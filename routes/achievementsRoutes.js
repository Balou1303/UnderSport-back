import express from 'express';
import achievementsController from '../controllers/achievementsController.js';
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();
router.get('/', achievementsController.getAllAchievement);
router.get('/:id', achievementsController.getAchievementById);
router.post('/', checkToken, checkAdmin, achievementsController.addAchievement);
router.put('/:id', checkToken, checkAdmin, achievementsController.updateAchievement);
router.delete('/:id', checkToken, checkAdmin, achievementsController.deleteAchievement);

export default router;