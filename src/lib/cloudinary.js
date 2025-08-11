import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (file) => {
  return new Promise(async (resolve, reject) => {
    try {
      const buffer = Buffer.from(await file.arrayBuffer());

      const stream = cloudinary.v2.uploader.upload_stream(
        { folder: 'product_categories' },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      stream.end(buffer);
    } catch (err) {
      reject(err);
    }
  });
};



export const deleteFromCloudinary = async (public_id) => {
  if (!public_id) return;
  
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (err) {
    console.error("Cloudinary Deletion Error:", err);
  }
};

export default cloudinary;