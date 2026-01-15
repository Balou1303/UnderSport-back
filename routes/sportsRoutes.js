import express from "express";
import sportsController from "../controllers/sportsController.js";
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", sportsController.getAllSports);
router.get("/:id", sportsController.getSportsById);
router.post("/", checkToken, checkAdmin, sportsController.addSport);
router.put("/:id", checkToken, checkAdmin, sportsController.updateSport);
router.delete("/:id", checkToken, checkAdmin, sportsController.deleteSport);


export default router;