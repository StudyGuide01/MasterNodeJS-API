import express from 'express';

const app = express();

//http methods
app.get('/', (req, res, next) => {
	res.json({ message: 'Hello get api' });
});

export default app;