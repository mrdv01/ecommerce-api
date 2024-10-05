import cloudinaryPackage from "cloudinary";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from 'dotenv';
dotenv.config();

//use specific version
const cloudinary = cloudinaryPackage.v2;

//configure cloudinary 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

//create storage engine for multer
// to sign or to upload file to cloudinary
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "Ecommerce-api",
        allowedFormats: ["jpg", "png", "jpeg"]
    },
});

//multer storage engine helps us to receive the file the user is  uploading

//Init multer with storage engine

const upload = multer({
    storage,

});

export default upload;