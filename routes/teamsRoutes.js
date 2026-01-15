import express from "express";
import teamsController from "../controllers/teamsController.js";
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", teamsController.getAllTeams);
router.get("/:id", teamsController.getTeamsById);
router.post("/", checkToken, checkAdmin, teamsController.addTeam);
router.put("/:id", checkToken, checkAdmin, teamsController.updateTeam);
router.delete("/:id", checkToken, checkAdmin, teamsController.deleteTeam);


export default router;