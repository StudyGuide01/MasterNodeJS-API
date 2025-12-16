import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
	try {
		//first do register
		mongoose.connection.on("connected", () => {
			console.log("connect to database successfully");
		});

		mongoose.connection.on("error", (err) => {
			console.log("Error in connecting to  database: ", err);
		});
		await mongoose.connect(config.databaseURL as string);


	} catch (error) {
		console.log("failed to connect db: ", error);
		process.exit(1);
	}
};

export default connectDB;
