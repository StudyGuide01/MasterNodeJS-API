import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import BookModel from "./bookModel.js";
import createHttpError from "http-errors";

import path from "node:path";
import url from "node:url";
import fs from "node:fs";
import type { AuthRequest } from "../middleware/authenticate.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const creatBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, genre } = req.body;

		const _req = req as AuthRequest;
		const userId = _req.userId;

		const files = req.files as {
			[fieldname: string]: Express.Multer.File[];
		};

		if (!files?.coverImage?.length || !files?.file?.length) {
			return next(createHttpError(400, "Cover image and PDF file are required"));
		}

		/* ---------- Cover Image Upload ---------- */

		const coverFile = files.coverImage[0];

		if (!coverFile) {
			return next(createHttpError(400, 'coverFile is not be empty'));
		}
		const coverImageMimeType = coverFile.mimetype.split("/").pop();

		if (!coverImageMimeType) {
			return next(createHttpError(400, "Invalid cover image mime type"));
		}

		const coverImagePath = path.resolve(
			__dirname,
			"../../public/data/uploads",
			coverFile.filename
		);

		const coverUploadResult = await cloudinary.uploader.upload(
			coverImagePath,
			{
				folder: "book-covers",
				filename_override: coverFile.filename,
				format: coverImageMimeType,
			}
		);

		/* ---------- PDF Upload ---------- */

		const bookFile = files.file[0];

		if (!bookFile) {
			return next(createHttpError(400, 'book file can not be empty'));
		}
		const bookFilePath = path.resolve(
			__dirname,
			"../../public/data/uploads",
			bookFile.filename
		);

		const bookUploadResult = await cloudinary.uploader.upload(
			bookFilePath,
			{
				resource_type: "raw",
				folder: "book-pdfs",
				filename_override: bookFile.filename,
				format: "pdf",
			}
		);

		/* ---------- Save to Database ---------- */

		const newBook = await BookModel.create({
			title,
			genre,
			author: userId,
			coverImage: coverUploadResult.secure_url,
			file: bookUploadResult.secure_url,
		});

		/* ---------- Delete Local Files ---------- */
		await Promise.all([
			fs.promises.unlink(coverImagePath),
			fs.promises.unlink(bookFilePath),
		]);

		res.status(201).json({
			success: true,
			data: newBook,
		});
	} catch (error) {
		next(error);
	}
};

export { creatBook };
