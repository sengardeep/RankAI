import express from "express";
import { registerUser, loginUser, getUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/auth.js";
const authRouter=express.Router();

authRouter.post("/register",registerUser);
authRouter.post("/login",loginUser);
authRouter.get("/user",authMiddleware,getUser);

export default authRouter;