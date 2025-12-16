import bcrypt from "bcrypt";

import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "./userModel.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	//statps to create api
	// 1. validation // express validtor
	// 2. process
	// 3. response

	const { name, email, password } = req.body;

	if (!name || !email || !password) {
		const errors = createHttpError(400, "All fields are required");
		return next(errors);
	}

	const user = await UserModel.findOne({ email });
	if (user) {
		const errors = createHttpError(400, "user already exist");
		next(errors);
	}

	const hasedPaswword = await bcrypt.hash(password, 10);

	const newUser = await UserModel.create({
		name,
		email,
		password: hasedPaswword,
	});

	//token genration
	const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, {
		expiresIn: "1d",
		algorithm: "HS256"
	});

	res
		.status(201)
		.json({ messae: "user created successfully", accessToken: token });
};

export { createUser };
