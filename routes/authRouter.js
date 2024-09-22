import express from "express";
import jwt from "jsonwebtoken";
import { login } from "../controllers/authControllers.js";
const authRouter = express.Router();

authRouter.post("/login", login);

export default authRouter;
