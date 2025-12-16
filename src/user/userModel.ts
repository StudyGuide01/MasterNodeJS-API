import mongoose from "mongoose";
import type { User } from "./userTypes.js";

const userSchema = new mongoose.Schema<User>({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
}, { timestamps: true });

const UserModel = mongoose.model<User>('User', userSchema); //('User', userSchema, 'author')

export default UserModel;