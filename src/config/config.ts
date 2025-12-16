import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
	port: Number(process.env.PORT) || 8080,
	databaseURL: process.env.MONGO_CONNECTION_STRING
};

export const config = Object.freeze(_config);
