const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const { protectAdmin } = require('../middlewares/adminAuth.middleware');

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'mazle-tote-products',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
        transformation: [{ width: 1200, height: 1200, crop: 'limit', quality: 'auto' }],
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @desc    Upload single image
// @route   POST /api/upload
// @access  Private (Admin)
router.post('/', protectAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        res.json({
            url: req.file.path,
            public_id: req.file.filename,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload image' });
    }
});

// @desc    Upload multiple images
// @route   POST /api/upload/multiple
// @access  Private (Admin)
router.post('/multiple', protectAdmin, upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded' });
        }

        const uploadedImages = req.files.map(file => ({
            url: file.path,
            public_id: file.filename,
        }));

        res.json(uploadedImages);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Failed to upload images' });
    }
});

// @desc    Delete image from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private (Admin)
router.delete('/:publicId', protectAdmin, async (req, res) => {
    try {
        await cloudinary.uploader.destroy(req.params.publicId);
        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ message: 'Failed to delete image' });
    }
});

module.exports = router;
