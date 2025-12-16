import type { NextFunction, Request, Response } from "express";

const creatBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {

	return res.json({ message: 'Ok' })

};

export { creatBook };
