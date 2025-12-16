import express from 'express';
import globlaErrorHandler from './middleware/globalErrorHandler.js';
import userRouter from './user/userRouter.js';
import bookRouter from './book/bookRouter.js';


const app = express();
app.use(express.json());

//http methods
app.get('/', (req, res, next) => {
	res.json({ message: 'Hello get api' });
});


//routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/books', bookRouter);


//global error handler
app.use(globlaErrorHandler)



export default app;