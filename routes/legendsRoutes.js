import express from 'express';
import legendsController from '../controllers/legendsController.js';
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get('/', legendsController.getAllLegends);
router.get('/:id', legendsController.getLegendById);
router.post('/', checkToken, checkAdmin, legendsController.addLegend);
router.put('/:id', checkToken, checkAdmin, legendsController.updateLegend);
router.delete('/:id', checkToken, checkAdmin, legendsController.deleteLegend);
router.post('/:id/achievements', checkToken, checkAdmin, legendsController.addAchievementToLegend);

export default router;