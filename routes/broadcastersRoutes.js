import express from 'express';
import broadcastersController from '../controllers/broadcastersController.js';
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get('/', broadcastersController.getAllBroadcasters);
router.get('/:id', broadcastersController.getBroadcasterById);
router.post('/', checkToken, checkAdmin, broadcastersController.addBroadcaster);
router.put('/:id', checkToken, checkAdmin, broadcastersController.updateBroadcaster);
router.delete('/:id', checkToken, checkAdmin, broadcastersController.deleteBroadcaster);

export default router;