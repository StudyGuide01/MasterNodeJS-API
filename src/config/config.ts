import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const _config = {
	port: Number(process.env.PORT) || 8080
};

export const config = Object.freeze(_config);
