import express from "express";
import usersController from "../controllers/usersController.js";
import checkToken from "../middleware/checkToken.js";
import checkAdmin from "../middleware/checkAdmin.js";

const router = express.Router();

router.get("/", checkToken, checkAdmin, usersController.getAllUsers);
router.get("/:id", checkToken, usersController.getUsersById);
router.post("/", usersController.addUsers);
router.put("/:id", checkToken, usersController.updateUser);
router.patch("/password/:id", checkToken, usersController.updatePassword);
router.delete("/:id", checkToken, usersController.deleteUser);
router.post("/login", usersController.login);
router.patch("/role/:id", checkToken, checkAdmin, usersController.updateRole)


export default router;