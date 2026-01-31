const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Product = require('../models/Product');
const Subscriber = require('../models/Subscriber');
const generateToken = require('../utils/generateToken');
const { protectAdmin } = require('../middlewares/adminAuth.middleware');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            const token = generateToken(admin._id, 'admin');

            // Set Cookie
            res.cookie('adminToken', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            });

            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                permissions: admin.permissions,
                message: 'Admin logged in successfully',
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

// @desc    Get Admin Data
// @route   GET /api/admin/me
// @access  Private (Admin)
router.get('/me', protectAdmin, async (req, res) => {
    try {
        const admin = {
            _id: req.admin._id,
            name: req.admin.name,
            email: req.admin.email,
            permissions: req.admin.permissions,
        };
        res.json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Get Dashboard Stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
router.get('/dashboard-stats', protectAdmin, async (req, res) => {
    try {
        const [orderStats, productCount, subscriberCount, recentOrders] = await Promise.all([
            Order.aggregate([
                {
                    $group: {
                        _id: null,
                        count: { $sum: 1 },
                        revenue: {
                            $sum: {
                                $cond: [{ $in: ['$status', ['Paid', 'Delivered', 'Shipped']] }, '$totalAmount', 0]
                            }
                        }
                    }
                }
            ]),
            Product.countDocuments({ isActive: true }),
            Subscriber.countDocuments(),
            Order.find({})
                .sort({ createdAt: -1 })
                .limit(5)
                .populate('user', 'name email')
                .select('_id user totalAmount status createdAt shippingAddress items') // Select only needed fields
        ]);

        res.json({
            orders: orderStats[0]?.count || 0,
            revenue: orderStats[0]?.revenue || 0,
            products: productCount,
            subscribers: subscriberCount,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Admin Logout
// @route   POST /api/admin/logout
// @access  Public
router.post('/logout', (req, res) => {
    res.cookie('adminToken', '', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
    });
    res.status(200).json({ message: 'Admin logged out successfully' });
});

module.exports = router;
