import express from 'express';
import matchesController from '../controllers/matchesController.js';
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get('/', matchesController.getAllMatches);
router.get('/:id', matchesController.getMatchById);
router.post('/', checkToken, checkAdmin, matchesController.addMatch);
router.put('/:id', checkToken, checkAdmin, matchesController.updateMatch);
router.delete('/:id', checkToken, checkAdmin, matchesController.deleteMatch);
router.patch('/score/:id', checkToken, checkAdmin, matchesController.updateScore);

export default router;