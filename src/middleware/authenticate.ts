import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";

const authenticat = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.header('Authorization');
		if (!token) {
			return next(createHttpError(401, 'Token autherization is required'));
		}

		const paresedToken = token.split(' ')[0];

		const decoded = jwt.verify(paresedToken, config.jwtSecret);

	} catch (error) {

	}


}