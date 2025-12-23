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
			return next(
				createHttpError(400, "Cover image and PDF file are required")
			);
		}

		/* ---------- Cover Image Upload ---------- */

		const coverFile = files.coverImage[0];

		if (!coverFile) {
			return next(createHttpError(400, "coverFile is not be empty"));
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

		const coverUploadResult = await cloudinary.uploader.upload(coverImagePath, {
			folder: "book-covers",
			filename_override: coverFile.filename,
			format: coverImageMimeType,
		});

		/* ---------- PDF Upload ---------- */

		const bookFile = files.file[0];

		if (!bookFile) {
			return next(createHttpError(400, "book file can not be empty"));
		}
		const bookFilePath = path.resolve(
			__dirname,
			"../../public/data/uploads",
			bookFile.filename
		);

		const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
			resource_type: "raw",
			folder: "book-pdfs",
			filename_override: bookFile.filename,
			format: "pdf",
		});

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

//udpate books

const updateBook = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title, genre } = req.body;
		const bookId = req.params.bookId;
		if (!bookId) {
			return next(createHttpError(401, "Book id is required"));
		}

		const book = await BookModel.findOne({ _id: bookId });

		if (!book) {
			return next(createHttpError(404, "Book not found"));
		}

		const _req = req as AuthRequest;
		if (book.author?.toString() !== _req.userId) {
			return next(
				createHttpError(401, "Unautherized, you can not update others book")
			);
		}

		let completCoverImage = book.coverImage;
		let completeFile = book.file;

		const files = req.files as {
			[fieldname: string]: Express.Multer.File[];
		};

		/* ---------- Cover Image ---------- */
		if (files?.coverImage) {
			const coverFile = files.coverImage[0];

			if (!coverFile) {
				return next(createHttpError(400, "coverFile is not be empty"));
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

			completCoverImage = coverUploadResult.secure_url;
			await fs.promises.unlink(coverImagePath);
		}

		/* ---------- Book File ---------- */
		if (files?.file) {
			const bookFile = files.file[0];

			if (!bookFile) {
				return next(createHttpError(400, "book file can not be empty"));
			}

			const bookFilePath = path.resolve(
				__dirname,
				"../../public/data/uploads",
				bookFile.filename
			);

			const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
				resource_type: "raw",
				folder: "book-pdfs",
				filename_override: bookFile.filename,
				format: "pdf",
			});

			completeFile = bookUploadResult.secure_url;
			await fs.promises.unlink(bookFilePath);
		}

		/* ---------- Update DB ---------- */
		await BookModel.findByIdAndUpdate(
			{ _id: bookId },
			{
				title,
				genre,
				coverImage: completCoverImage ? completCoverImage : book.coverImage,
				file: completeFile ? completeFile : book.file,
			},
			{ new: true }
		);

		res.status(200).json({
			message: "Book updated successfully",
		});
	} catch (error) {
		return next(createHttpError(500, "server errror to update book"));
	}
};

//get book endpoints
//mongoose pagination to get all books in steps

const getAllBooks = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const book = await BookModel.find();
		return res.json({ book });
	} catch (error) {
		return next(createHttpError(500, "Error while getting book"));
	}
};

//get single book

const getSingleBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const bookId = req.params.bookId;

	try {
		if (!bookId) {
			return next(createHttpError(404, "Book id is required"));
		}
		const book = await BookModel.findOne({ _id: bookId });
		if (!book) {
			return next(createHttpError(404, "Book is not defined"));
		}

		return res.json({ book });
	} catch (error) {
		return next(createHttpError(500, "Error while getting single book"));
	}
};


//delete book

const deleteBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bookId } = req.params;

		if (!bookId) {
			return next(createHttpError(400, 'Book id is required'));
		}

		const book = await BookModel.findById(bookId);
		if (!book) {
			return next(createHttpError(404, 'Book not found'));
		}

		/* ================================
		   Extract Cover Image Public ID
		   ================================ */

		// example:
		// book-covers/v9nuvtqqfwxns36cfw3w.jpg
		const coverImageParts = book.coverImage.split('/');
		const coverImagePublicId =
			coverImageParts.at(-2) +
			'/' +
			coverImageParts.at(-1)?.split('.').at(0);

		/* ================================
		   Extract Book File Public ID (RAW)
		   ================================ */

		// example:
		// book-files/my-book.pdf  →  book-files/my-book
		const bookFileParts = book.file.split('/');
		const bookFilePublicId =
			bookFileParts.at(-2) +
			'/' +
			bookFileParts.at(-1)?.split('.').at(0);

		/* ================================
		   Delete from Cloudinary (SEQUENTIAL)
		   ================================ */

		try {
			await cloudinary.uploader.destroy(coverImagePublicId);

			await cloudinary.uploader.destroy(bookFilePublicId, {
				resource_type: 'raw',
			});
		} catch (err) {
			console.error('Cloudinary delete error:', err);
			return next(
				createHttpError(502, 'Failed to delete files from Cloudinary')
			);
		}

		/* ================================
		   Delete DB Record
		   ================================ */

		await BookModel.findByIdAndDelete(bookId);

		return res.status(200).json({
			success: true,
			message: 'Book deleted successfully',
		});
	} catch (error) {
		console.error(error);
		return next(createHttpError(500, 'Internal server error'));
	}
};

export { creatBook, updateBook, getAllBooks, getSingleBook, deleteBook };
