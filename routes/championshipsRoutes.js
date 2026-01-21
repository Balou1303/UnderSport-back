import express from 'express';
import championshipsController from '../controllers/championshipsController.js';
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get('/', championshipsController.getAllChampionships);
router.get('/:id', championshipsController.getChampionShipsById);
router.post('/', checkToken, checkAdmin, championshipsController.addChampionShip);
router.put('/:id', checkToken, checkAdmin, championshipsController.updateChampionship);
router.delete('/:id', checkToken, checkAdmin, championshipsController.deleteChampionship);

export default router;