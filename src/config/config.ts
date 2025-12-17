import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
	port: Number(process.env.PORT) || 8080,
	databaseURL: process.env.MONGO_CONNECTION_STRING,
	env: process.env.NODE_ENV,
	jwtSecret: process.env.JWT_SECRET,
	cloudinaryName: process.env.CLOUDE_NAME,
	cloudinary_api_key: process.env.CLOUDE_API_KEY,
	api_secret: process.env.CLOUDE_API_SECRET

};

export const config = Object.freeze(_config);
