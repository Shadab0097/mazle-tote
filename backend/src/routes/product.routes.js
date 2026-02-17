const express = require('express');
const productRouter = express.Router();
const Product = require('../models/Product');
const { protectAdmin } = require('../middlewares/adminAuth.middleware');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
productRouter.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ isHottest: -1, createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private (Admin)
productRouter.post('/', protectAdmin, async (req, res) => {
    try {
        const { name, slug, description, price, images, stock, isHottest } = req.body;

        const productExists = await Product.findOne({ slug });

        if (productExists) {
            res.status(400);
            throw new Error('Product with this slug already exists');
        }

        const product = new Product({
            name,
            slug,
            description,
            price,
            images,
            stock,
            isHottest: isHottest || false,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

// @desc    Bulk create products
// @route   POST /api/products/bulk
// @access  Public (Temporary for migration)
// productRouter.post('/bulk', async (req, res) => {
//     try {
//         const products = req.body;

//         if (!Array.isArray(products)) {
//             return res.status(400).json({ message: 'Request body must be an array of products' });
//         }

//         const stats = {
//             success: 0,
//             failed: 0,
//             errors: []
//         };

//         for (const productData of products) {
//             try {
//                 // Check if exists
//                 const existing = await Product.findOne({ slug: productData.slug });
//                 if (existing) {
//                     stats.failed++;
//                     stats.errors.push(`Skipped ${productData.name}: Slug already exists`);
//                     continue;
//                 }

//                 await Product.create(productData);
//                 stats.success++;
//             } catch (err) {
//                 stats.failed++;
//                 stats.errors.push(`Failed ${productData.name}: ${err.message}`);
//             }
//         }

//         res.status(201).json({
//             message: 'Bulk import completed',
//             stats
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
productRouter.get('/:slug', async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug });

        if (product) {
            res.json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private (Admin)
productRouter.put('/:id', protectAdmin, async (req, res) => {
    try {
        const { name, slug, description, price, images, stock, isActive, isHottest } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.slug = slug || product.slug;
            product.description = description || product.description;
            product.price = price !== undefined ? price : product.price;
            product.images = images || product.images;
            product.stock = stock !== undefined ? stock : product.stock;
            product.isActive = isActive !== undefined ? isActive : product.isActive;
            product.isHottest = isHottest !== undefined ? isHottest : product.isHottest;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private (Admin)
productRouter.delete('/:id', protectAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await Product.deleteOne({ _id: product._id });
            res.json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

module.exports = productRouter;
