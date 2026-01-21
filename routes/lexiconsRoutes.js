import express from 'express';
import lexiconsController from '../controllers/lexiconsController.js';
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get('/', lexiconsController.getAllLexicons);
router.get('/:id', lexiconsController.getLexiconById);
router.post('/', checkToken, checkAdmin, lexiconsController.addLexicon);
router.put('/:id', checkToken, checkAdmin, lexiconsController.updateLexicon);
router.delete('/:id', checkToken, checkAdmin, lexiconsController.deleteLexicon);

export default router;