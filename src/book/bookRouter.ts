import express from "express";
import multer from "multer";

import path from 'node:path';
import url from 'node:url';

import { creatBook, getAllBooks, getSingleBook, updateBook } from "./bookController.js";
import authenticat from "../middleware/authenticate.js";

const rootPath = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(rootPath);


const bookRouter = express.Router();

const upload = multer({
	dest: path.resolve(__dirname, '../../public/data/uploads'),
	limits: { fileSize: 3e7 } //30mb
})

bookRouter.post('/create-book', authenticat, upload.fields([
	{ name: 'coverImage', maxCount: 1 },
	{ name: 'file', maxCount: 1 }
]), creatBook);

// bookRouter.patch('/update-book/:bookId', authenticat, updateBook);
bookRouter.patch(
	"/update-book/:bookId",
	authenticat,
	upload.fields([
		{ name: "coverImage", maxCount: 1 },
		{ name: "file", maxCount: 1 },
	]),
	updateBook
);

bookRouter.get('/get-allBook', getAllBooks);
bookRouter.get('/get-singleBook/:bookId', getSingleBook)


export default bookRouter;
