import express from 'express';
import externalApiController from '../controllers/externalApiController.js';
import nbaController from '../controllers/nbaController.js';

const router = express.Router();

// Route pour récupérer le classement (ex: /api/external/standings ou /api/external/standings/FL1)
router.get('/standings', externalApiController.getStandings);
router.get('/standings/:league', externalApiController.getStandings);

// Route pour récupérer les matchs (ex: /api/external/matches ou /api/external/matches/FL1)
router.get('/matches', externalApiController.getMatches);
router.get('/matches/:league', externalApiController.getMatches);

// Route pour récupérer les matchs en direct (ex: /api/external/live ou /api/external/live/FL1)
router.get('/live', externalApiController.getLiveMatches);
router.get('/live/:league', externalApiController.getLiveMatches);

// Routes NBA
router.get('/nba/matches/:date', nbaController.getMatches);

export default router;
