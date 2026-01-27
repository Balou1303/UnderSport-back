import express from "express";
import rulesController from "../controllers/rulesController.js";
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", rulesController.getAllRules);
router.get("/:id", rulesController.getRulesById);
router.post("/", checkToken, checkAdmin, rulesController.addRule);
router.put("/:id", checkToken, checkAdmin, rulesController.updateRule);
router.delete("/:id", checkToken, checkAdmin, rulesController.deleteRule);

router.get('/sports/:idSport', rulesController.getRulesBySport);
router.post('/sports', rulesController.addRuleToSport);
router.delete('/:idRule/sports/:idSport', rulesController.deleteRuleFromSport);

export default router;