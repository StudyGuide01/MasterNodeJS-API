import express from "express";
import multer from "multer";

import path from 'node:path';
import url from 'node:url';

import { creatBook } from "./bookController.js";

const rootPath = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(rootPath);


const bookRouter = express.Router();

const upload = multer({
	dest: path.resolve(__dirname, '../../public/data/uploads'),
	limits: { fileSize: 3e7 } //30mb
})

bookRouter.post('/create-book', upload.fields([
	{ name: 'coverImage', maxCount: 1 },
	{ name: 'file', maxCount: 1 }
]), creatBook)

export default bookRouter;
