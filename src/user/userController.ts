import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	//statps to create api
	// 1. validation
	// 2. process
	// 3. response

	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		const errors = createHttpError(400, "All fields are required");
		return next(errors);
	}


};

export { createUser };
