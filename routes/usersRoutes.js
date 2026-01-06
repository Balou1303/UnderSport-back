import express from "express";
import usersController from "../controllers/usersController.js"

const router = express.Router();

router.get("/", usersController.getAllUsers)


export default router