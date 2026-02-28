import express from 'express';
import externalApiController from '../controllers/externalApiController.js';

const router = express.Router();

// Route pour récupérer le classement (ex: /api/external/standings ou /api/external/standings/FL1)
// En Express 5, la syntaxe /:league? n'est plus supportée, il faut définir les deux routes explicitement
router.get('/standings', externalApiController.getStandings);
router.get('/standings/:league', externalApiController.getStandings);

// Route pour récupérer les matchs (ex: /api/external/matches ou /api/external/matches/FL1)
router.get('/matches', externalApiController.getMatches);
router.get('/matches/:league', externalApiController.getMatches);

// Route pour récupérer les matchs en direct (ex: /api/external/live ou /api/external/live/FL1)
router.get('/live', externalApiController.getLiveMatches);
router.get('/live/:league', externalApiController.getLiveMatches);

export default router;
