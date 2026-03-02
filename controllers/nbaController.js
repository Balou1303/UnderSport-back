import axios from 'axios';

const getApiKey = () => {
    const key = process.env.BALL_DONT_LIE_API;
    if (!key) {
        throw new Error("La clé d'API BALL_DONT_LIE_API n'est pas configurée dans le fichier .env");
    }
    return key;
};

const nbaApi = axios.create({
    baseURL: 'https://api.balldontlie.io/v1',
});

nbaApi.interceptors.request.use(config => {
    config.headers['Authorization'] = getApiKey();
    return config;
});

// ─── CACHE SYSTÈME ─────────────────────────────────────
const cache = new Map();
const CACHE_TTL = 30 * 1000; // 30 secondes

const getCached = (key) => {
    const entry = cache.get(key);
    if (!entry) return null;
    const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
    return isExpired ? null : entry.data;
};

const setCache = (key, data) => {
    cache.set(key, { data, timestamp: Date.now() });
};

const nbaController = {
    // Récupérer les matchs pour une date précise
    getMatches: async (req, res) => {
        try {
            const { date } = req.params; // Format YYYY-MM-DD
            const cacheKey = `nba_matches_${date}`;

            const cachedData = getCached(cacheKey);
            if (cachedData) {
                console.log(`[NBA CACHE HIT] ${date}`);
                return res.status(200).json(cachedData);
            }

            // Mapping des abréviations divergentes entre Balldontlie et ESPN
            const TEAM_ABBR_MAP = {
                'NOP': 'no',  // New Orleans Pelicans
                'GSW': 'gs',  // Golden State Warriors
                'SAS': 'sa',  // San Antonio Spurs
                'NYK': 'ny',  // New York Knicks
                'OKC': 'okc',
                'PHX': 'phx',
                'UTA': 'utah', // Parfois Utah est 'utah' au lieu de 'uta'
            };

            const getLogoUrl = (abbr) => {
                const espnAbbr = TEAM_ABBR_MAP[abbr] || abbr.toLowerCase();
                return `https://a.espncdn.com/i/teamlogos/nba/500/${espnAbbr}.png`;
            };

            // L'API balldontlie utilise des query params pour filtrer par date
            // Note: dates[] est un tableau dans l'API
            const response = await nbaApi.get('/games', {
                params: {
                    'dates[]': date
                }
            });

            // On reformate un peu pour que ça ressemble à ce que le front attend (similaire au foot)
            const matches = response.data.data.map(game => {
                let status = game.status;
                const gameDate = game.date.split('T')[0];

                // Gestion de l'heure et du statut
                if (status.includes('T') && status.includes('Z')) {
                    // C'est une date ISO UTC (ex: 2026-03-03T01:30:00Z)
                    const dateObj = new Date(status);
                    if (!isNaN(dateObj)) {
                        // On ajoute +1h pour l'heure française (Hiver)
                        // Note: toLocaleTimeString avec timeZone: 'Europe/Paris' est plus sûr
                        status = dateObj.toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit',
                            timeZone: 'Europe/Paris'
                        });
                    } else {
                        status = "À venir";
                    }
                } else if (status.includes(':')) {
                    // C'est le format Balldontlie standard (ex: "7:30 PM" ET)
                    const matchTime = status.match(/(\d+):(\d+)\s*(AM|PM)?/i);
                    if (matchTime) {
                        let hours = parseInt(matchTime[1]);
                        const minutes = matchTime[2];
                        const ampm = matchTime[3] ? matchTime[3].toUpperCase() : null;

                        if (ampm === 'PM' && hours < 12) hours += 12;
                        if (ampm === 'AM' && hours === 12) hours = 0;

                        // Décalage de +6h (ET -> CET)
                        hours = (hours + 6) % 24;
                        status = `${String(hours).padStart(2, '0')}:${minutes}`;
                    }
                }

                return {
                    id: game.id,
                    status: status,
                    homeTeam: {
                        name: game.home_team.full_name,
                        shortName: game.home_team.abbreviation,
                        crest: getLogoUrl(game.home_team.abbreviation)
                    },
                    awayTeam: {
                        name: game.visitor_team.full_name,
                        shortName: game.visitor_team.abbreviation,
                        crest: getLogoUrl(game.visitor_team.abbreviation)
                    },
                    score: {
                        fullTime: {
                            home: game.home_team_score,
                            away: game.visitor_team_score
                        }
                    },
                    utcDate: gameDate,
                    period: game.period,
                    time: game.time
                };
            });

            const result = { matches };
            setCache(cacheKey, result);
            res.status(200).json(result);
        } catch (error) {
            console.error("Erreur API NBA:", error?.response?.data || error.message);
            res.status(500).json({ error: "Impossible de récupérer les matchs NBA." });
        }
    }
};

export default nbaController;
