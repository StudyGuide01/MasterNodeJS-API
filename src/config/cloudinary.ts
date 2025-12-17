import { v2 as cloudinary } from 'cloudinary';
import { config as cloudconfiguration } from './config.js';

cloudinary.config({
	cloud_name: cloudconfiguration.cloudinaryName as string,
	api_key: cloudconfiguration.cloudinary_api_key as string,
	api_secret: cloudconfiguration.api_secret as string
});

export default cloudinary;