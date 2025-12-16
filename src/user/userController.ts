import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import UserModel from "./userModel.js";

import { config } from "../config/config.js";
import type { User } from "./userTypes.js";

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

	try {
		const user = await UserModel.findOne({ email });
		if (user) {
			const errors = createHttpError(400, "user already exist");
			next(errors);
		}
	} catch (error) {
		return next(createHttpError(500, "Error while getting user"));
	}

	const hasedPaswword = await bcrypt.hash(password, 10);

	let newUser: User;
	try {
		newUser = await UserModel.create({
			name,
			email,
			password: hasedPaswword,
		});
	} catch (error) {
		return next(createHttpError(500, "Error while creating user"));
	}
	//token genration
	const token = jwt.sign({ sub: newUser._id }, config.jwtSecret as string, {
		expiresIn: "1d",
		algorithm: "HS256",
	});

	res
		.status(201)
		.json({ messae: "user created successfully", accessToken: token });
};


const login = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(createHttpError(400, 'All feilds are required'));
	}
	let user;
	try {
		user = await UserModel.findOne({ email });
		if (!user) {
			return next(createHttpError(404, 'User not found'));
		}

	} catch (error) {
		return next(createHttpError(400, 'While fetching error to login'));
	}



	const isMatch = await bcrypt.compare(password, user.password);

	if (!isMatch) {
		return next(createHttpError(400, 'Password is invalid'));
	}
	const token = jwt.sign({ sub: user._id }, config.jwtSecret as string, { expiresIn: '1d' });

	return res.status(200).json({ message: 'User logedin', accessToken: token });

}

export { createUser, login };
