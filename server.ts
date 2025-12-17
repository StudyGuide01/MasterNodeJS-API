import "dotenv/config";

import { config } from "./src/config/config.js";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";

const startServer = async () => {
	await connectDB();
	app.listen(config.port, () => {
		console.log(`server is running on port: ${config.port}`);
	});
};

startServer();
