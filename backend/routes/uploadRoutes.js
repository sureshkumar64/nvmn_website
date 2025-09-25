import express from 'express';
import fs from 'fs';
import upload from '../config/multer.js';
import uploads from '../config/cloudinary.js';
const router = express.Router();

// Max count = 4 images
router.post('/', upload.array('images', 4), async (req, res) => {
  const uploader = async (path) =>
    await uploads(path, 'fashionshop/products');

  if (req.method === 'POST') {
    try {
      const results = [];
      const files = req.files;
      for (const file of files) {
        const result = await uploader(file.path);
        results.push(result); // Push full result: { url, id }
        fs.unlinkSync(file.path);
      }

      res.status(200).json({
        message: 'Images uploaded successfully',
        data: results, // Array of { url, id }
      });
    } catch (err) {
      console.error('Image upload failed:', err);
      res.status(500).json({
        message: 'Image upload failed',
        error: err.message,
      });
    }
  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`,
    });
  }
});

export default router;