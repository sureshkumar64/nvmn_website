import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploads = (file, folder) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload(
      file,
      { folder },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return resolve({ url: undefined, id: undefined });
        }
        console.log('Cloudinary raw result:', result);
        resolve({
          url: result.secure_url,
          id: result.public_id,
        });
      }
    );
  });
};

export default uploads;