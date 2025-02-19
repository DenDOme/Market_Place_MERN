import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function getPublicId(imageUrl) {
  const parts = imageUrl.split("/");
  return parts.slice(-2).join("/").split(".")[0];
}

export default cloudinary;
