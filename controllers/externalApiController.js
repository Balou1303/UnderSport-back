import axios from 'axios';

// récupérer la clé API
const getApiKey = () => {
    const key = process.env.FOOTBALL_DATA_API_KEY;
    if (!key) {
        throw new Error("La clé d'API FOOTBALL_DATA_API_KEY n'est pas configurée dans le fichier .env");
    }
    return key;
};

// Instance Axios pré-configurée pour football-data.org
const footballApi = axios.create({
    baseURL: 'https://api.football-data.org/v4',
});

// Intercepteur pour injecter la clé API dynamiquement
footballApi.interceptors.request.use(config => {
    config.headers['X-Auth-Token'] = getApiKey();
    return config;
});

// ─── CACHE SYSTÈME ─────────────────────────────────────
// Cache en mémoire avec TTL de 30 secondes pour éviter le rate-limit (10 req/min)
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 secondes

const getCached = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
    if (!isExpired) {
        console.log(`[CACHE HIT] ${key}`);
        return entry.data;
    }
    return null; // On renvoie null pour forcer le refresh, mais on garde l'objet en Map au cas où
};

const setCache = (key, newData) => {
    const oldEntry = cache.get(key);

    // Si on a déjà des données en cache pour cette URL de matchs, on fait du "Score Shielding"
    if (oldEntry && newData.matches && Array.isArray(newData.matches)) {
        const oldMatchesMap = new Map();
        oldEntry.data.matches?.forEach(m => oldMatchesMap.set(m.id, m));

        newData.matches = newData.matches.map(newMatch => {
            const oldMatch = oldMatchesMap.get(newMatch.id);
            if (!oldMatch) return newMatch;

            // BOUCLIER DE SCORE : Si le nouveau match est TIMED mais que l'ancien était LIVE/FINISHED
            // On garde l'ancien status et l'ancien score pour éviter la "disparition"
            const statusesToProtect = ['IN_PLAY', 'PAUSED', 'LIVE', 'FINISHED'];
            const newIsTimed = ['SCHEDULED', 'TIMED'].includes(newMatch.status);
            const oldWasLive = statusesToProtect.includes(oldMatch.status);

            if (newIsTimed && oldWasLive) {
                console.log(`[SCORE SHIELD] Protection du match ${newMatch.id} (${newMatch.homeTeam.name}) contre régression.`);
                return oldMatch;
            }
            return newMatch;
        });
    }

    cache.set(key, { data: newData, timestamp: Date.now() });
};

// ─── DATE SERVEUR API ──────────────────────────────────
// La date réelle du serveur API (vs la date système qui peut être décalée)
let cachedServerDate = null;

footballApi.interceptors.response.use(response => {
    if (response.headers['date']) {
        cachedServerDate = new Date(response.headers['date']).toISOString().split('T')[0];
    }
    return response;
});

// LIGUE 1 ID sur football-data.org = 'FL1'
const DEFAULT_LEAGUE = 'FL1';

const fetchWithCache = async (url) => {
    const cachedData = getCached(url);
    if (cachedData) return cachedData;

    try {
        const response = await footballApi.get(url);
        console.log(`[API CALL SUCCESS] ${url} | Matches: ${response.data.matches?.length || 0}`);
        if (response.data.matches?.length > 0) {
            const statuses = [...new Set(response.data.matches.map(m => m.status))];
            console.log(`[API DATA] Statuses found: ${statuses.join(', ')}`);
        }
        setCache(url, response.data);
        return response.data;
    } catch (error) {
        // FALLBACK : Si l'API échoue (ex: Rate Limit 429), on tente de renvoyer ce qu'on a en cache
        // même si c'est expiré, au lieu de faire une erreur 500
        const oldEntry = cache.get(url);
        if (oldEntry) {
            console.warn(`[CACHE FALLBACK] Utilisation donnée expirée pour ${url} suite à erreur API.`);
            return oldEntry.data;
        }
        throw error; // Si rien en cache du tout, on laisse l'erreur remonter
    }
};

const externalApiController = {
    // Classement (Standings)
    getStandings: async (req, res) => {
        try {
            const league = req.params.league || DEFAULT_LEAGUE;
            const data = await fetchWithCache(`/competitions/${league}/standings`);
            res.status(200).json(data);
        } catch (error) {
            console.error("Erreur API Standings:", error?.response?.data || error.message);
            res.status(500).json({ error: "Impossible de récupérer le classement sportif." });
        }
    },

    // Résultats récents et Matchs à venir (Matches)
    getMatches: async (req, res) => {
        try {
            const league = req.params.league || DEFAULT_LEAGUE;
            const { dateFrom, dateTo } = req.query;
            const status = req.query.status || 'SCHEDULED,LIVE,IN_PLAY,PAUSED,FINISHED';

            let url = `/competitions/${league}/matches?status=${status}`;
            if (dateFrom && dateTo) {
                url += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
            }

            const data = await fetchWithCache(url);
            res.status(200).json(data);
        } catch (error) {
            console.error("Erreur API Matches:", error?.response?.data || error.message);
            res.status(500).json({ error: "Impossible de récupérer les matchs." });
        }
    },

    // Matchs du jour RÉEL (date du serveur API, pas du système local)
    getLiveMatches: async (req, res) => {
        try {
            const league = req.params.league || DEFAULT_LEAGUE;

            // Si on n'a pas encore la date réelle, on fait un appel léger
            if (!cachedServerDate) {
                await footballApi.get(`/competitions/${league}`);
            }

            const serverDate = cachedServerDate || new Date().toISOString().split('T')[0];
            console.log(`[getLiveMatches] Date serveur API : ${serverDate} | Date système : ${new Date().toISOString().split('T')[0]}`);

            // Récupérer TOUS les matchs du jour réel
            const url = `/competitions/${league}/matches?dateFrom=${serverDate}&dateTo=${serverDate}`;
            const data = await fetchWithCache(url);

            res.status(200).json(data);
        } catch (error) {
            console.error("Erreur API Live:", error?.response?.data || error.message);
            res.status(500).json({ error: "Impossible de récupérer les matchs en direct." });
        }
    }
};

export default externalApiController;
