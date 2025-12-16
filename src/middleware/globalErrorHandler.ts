import type { HttpError } from "http-errors";
import express, {
	type NextFunction,
	type Request,
	type Response,
} from "express";
import { config } from "../config/config.js";

const globlaErrorHandler = (
	err: HttpError,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = err.statusCode || 500;
	return res.status(statusCode).json({
		message: err.message,
		errorStack: config.env === "development" ? err.stack : "", // used only development mode
	});
};

export default globlaErrorHandler;
