import express from 'express';
import globlaErrorHandler from './middleware/globalErrorHandler.js';
import userRouter from './user/userRouter.js';


const app = express();
app.use(express.json());

//http methods
app.get('/', (req, res, next) => {
	res.json({ message: 'Hello get api' });
});


//routes
app.use('/api/v1/users', userRouter);


//global error handler
app.use(globlaErrorHandler)



export default app;