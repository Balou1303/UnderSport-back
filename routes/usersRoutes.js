import express from "express";
import usersController from "../controllers/usersController.js"

const router = express.Router();

router.get("/", usersController.getAllUsers)
router.get("/:id", usersController.getUsersById)
router.post("/", usersController.addUsers)
router.put("/:id", usersController.updateUser)
router.patch("/password/:id", usersController.updatePassword)
router.delete("/:id", usersController.deleteUser)


export default router;