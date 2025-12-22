import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

export interface AuthRequest extends Request {
	userId: string
}

const authenticat = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization');
		if (!token) {
			return next(createHttpError(401, 'Token autherization is required'));
		}

		const paresedToken = token.split(' ')[1];

		if (!paresedToken) {
			return next(createHttpError(400, 'token is not parsed'));
		}

		const decoded = jwt.verify(paresedToken, config.jwtSecret as string);

		if (!decoded) {
			return next(createHttpError(401, 'token is expired please do login, first'));
		}

		const _req = req as AuthRequest;
		_req.userId = decoded.sub as string;
		next();

	} catch (error) {
		return next(error);
	}
}

export default authenticat;
