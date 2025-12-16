import express from "express";
import { creatBook } from "./bookController.js";


const bookRouter = express.Router();



bookRouter.post('/creat-book', creatBook)

export default bookRouter;
