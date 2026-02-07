import express from 'express';
import championshipsController from '../controllers/championshipsController.js';
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";
import multerConfig from "../middleware/multerConfig.js";

const router = express.Router();

router.get('/', championshipsController.getAllChampionships);
router.get('/:id', championshipsController.getChampionShipsById);

router.get('/sport/:idSport', championshipsController.championshipBySportId);

router.post('/', checkToken, checkAdmin, multerConfig, championshipsController.addChampionShip);
router.put('/:id', checkToken, checkAdmin, multerConfig, championshipsController.updateChampionship);
router.delete('/:id', checkToken, checkAdmin, championshipsController.deleteChampionship);

export default router;