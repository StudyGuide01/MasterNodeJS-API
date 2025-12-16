import express, { type Request, type Response } from "express";
import { createUser, login } from "./userController.js";

const userRouter = express.Router();

//endpoints
userRouter.post("/register", createUser);
userRouter.post('/login', login);




export default userRouter;
