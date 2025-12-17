import type { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary.js";
import createHttpError from "http-errors";

import path from "node:path";
import url from "node:url";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const creatBook = async (req: Request, res: Response, next: NextFunction) => {
	const { title, genre } = req.body;

	const files = req.files as { [fieldname: string]: Express.Multer.File[] };

	if (!files || !files.coverImage || !files.file || files.coverImage.length === 0) {
		return next(createHttpError(400, "file is required"));
	}

	const coverImageMimeType = files.coverImage[0]?.mimetype.split("/").at(-1);

	if (!coverImageMimeType) {
		return next(createHttpError(400, "mim type is mendetary"));
	}

	const filename = files.coverImage[0]?.filename;
	const filePath = path.resolve(
		__dirname,
		"../../public/data/uploads",
		filename as string
	);

	const uploadResult = await cloudinary.uploader.upload(filePath, {
		filename_override: filename!,
		folder: "book-covers",
		format: coverImageMimeType,
	});

	//pdf uploader
	try {
		const bookFilename = files.file[0]?.filename;
		const bookFilePath = path.resolve(
			__dirname,
			"../../public/data/uploads",
			bookFilename as string
		);

		const bookUploadResult = await cloudinary.uploader.upload(bookFilePath, {
			resource_type: 'raw',
			folder: 'book-pdfs',
			format: 'pdf'
		})

		console.log("book file upload result ", bookUploadResult);
	} catch (error) {
		console.log(error);
	}



	res.json({});
};

export { creatBook };

// import type { NextFunction, Request, Response } from "express";
// import cloudinary from "../config/cloudinary.js";
// import createHttpError from "http-errors";

// import path from "node:path";
// import url from "node:url";

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const creatBook = async (req: Request, res: Response, next: NextFunction) => {
// 	try {
// 		const { title, genre } = req.body;

// 		const files = req.files as { coverImage?: Express.Multer.File[]; };

// 		if (!files?.coverImage?.length) {
// 			return next(createHttpError(400, "cover image is required"));
// 		}

// 		const coverImage = files.coverImage[0];

// 		// mime type → format
// 		const format = coverImage!.mimetype.split("/").pop();

// 		// cloudinary upload
// 		const uploadResult = await cloudinary.uploader.upload(
// 			coverImage!.path,
// 			{
// 				folder: "book-covers",
// 				filename_override: coverImage!.filename,
// 				...(format && { format }),
// 			}
// 		);

// 		console.log("upload result:", uploadResult);

// 		res.status(201).json({
// 			success: true,
// 			message: "Book created successfully",
// 			data: {
// 				title,
// 				genre,
// 				coverImage: uploadResult.secure_url,
// 			},
// 		});
// 	} catch (error) {
// 		next(error);
// 	}
// };

// export { creatBook };
