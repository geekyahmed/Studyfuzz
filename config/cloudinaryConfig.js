require('dotenv').config()
const {config, uploader} = require('cloudinary')

const cloudinaryConfig = () =>
  config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
export { cloudinaryConfig, uploader };