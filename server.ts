import { config } from "./src/config/config.js";
import app from "./src/app.js";

const startServer = () => {
	app.listen(config.port, () => {
		console.log(`server is running on port: ${config.port}`);
	});
};

startServer();
