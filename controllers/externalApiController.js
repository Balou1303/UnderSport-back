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

// LIGUE 1 ID sur football-data.org = 'FL1'
const DEFAULT_LEAGUE = 'FL1';

const externalApiController = {
    // Classement (Standings)
    getStandings: async (req, res) => {
        try {
            const league = req.params.league || DEFAULT_LEAGUE;

            // appelle l'API externe (ex: /competitions/FL1/standings)
            const response = await footballApi.get(`/competitions/${league}/standings`);

            // renvoie juste ce dont le Front a besoin
            res.status(200).json(response.data);
        } catch (error) {
            console.error("Erreur API Standings:", error?.response?.data || error.message);
            res.status(500).json({ error: "Impossible de récupérer le classement sportif." });
        }
    },

    // Résultats récents et Matchs à venir (Matches)
    getMatches: async (req, res) => {
        try {
            const league = req.params.league || DEFAULT_LEAGUE;

            // status=FINISHED (Résultats) ou status=SCHEDULED (A venir)
            const status = req.query.status || 'SCHEDULED,FINISHED';

            // limite pour ne pas envoyer 380 matchs au front...
            // peut filtrer sur la "matchday" (journée) actuelle, mais c'est complexe sans connaître la journée.

            const response = await footballApi.get(`/competitions/${league}/matches?status=${status}`);

            res.status(200).json(response.data);
        } catch (error) {
            console.error("Erreur API Matches:", error?.response?.data || error.message);
            res.status(500).json({ error: "Impossible de récupérer les matchs." });
        }
    }
};

export default externalApiController;
