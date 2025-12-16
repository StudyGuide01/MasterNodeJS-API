import express, { type NextFunction, type Request, type Response } from 'express';
import createHttpError, { type HttpError } from 'http-errors';
import { config } from './config/config.js';
import globlaErrorHandler from './middleware/globalErrorHandler.js';


const app = express();

//http methods
app.get('/', (req, res, next) => {
	// throw new Error('somthing went wrong');
	// const errors = createHttpError(400, 'something wents wrong');
	// throw errors;
	res.json({ message: 'Hello get api' });
});


//global error handler
app.use(globlaErrorHandler)



export default app;