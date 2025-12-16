import express, { type Request, type Response } from "express";
import { createUser } from "./userController.js";

const userRouter = express.Router();

//endpoints
userRouter.post("/register", createUser);




export default userRouter;
