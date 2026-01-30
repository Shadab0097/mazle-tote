const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const User = require('../models/User');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const { protect } = require('../middlewares/userAuth.middleware');
const { protectAdmin } = require('../middlewares/adminAuth.middleware');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
router.post('/', protect, async (req, res) => {
    try {
        const { items, shippingAddress, payment, totalAmount, charityTrust } = req.body;

        if (items && items.length === 0) {
            res.status(400);
            throw new Error('No order items');
        }

        if (!charityTrust) {
            res.status(400);
            throw new Error('Please select a charity trust');
        }

        const validTrusts = [
            'Green Earth Foundation',
            'Children Education Trust',
            'Animal Welfare Society',
            'StandWithUs',
            'Combat Campus Antisemitism',
            'Blue Square Alliance'
        ];
        if (!validTrusts.includes(charityTrust)) {
            res.status(400);
            throw new Error('Invalid charity trust selected');
        }

        const order = new Order({
            user: req.user._id,
            items,
            shippingAddress,
            charityTrust,
            payment,
            totalAmount,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private (User)
router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get All Orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
router.get('/', protectAdmin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Custom middleware for protecting both User and Admin for GET /:id
const protectBoth = async (req, res, next) => {
    // Check cookies instead of header
    const { token, adminToken } = req.cookies || {};

    if (adminToken) {
        try {
            const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
            if (decoded.type === 'admin') {
                req.admin = await Admin.findById(decoded.id).select('-password');
                if (req.admin) return next();
            }
        } catch (e) { } // Fall through to check user
    }

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            if (decoded.type === 'user') {
                req.user = await User.findById(decoded.id).select('-password');
                if (req.user) return next();
            }
        } catch (e) { }
    }

    // If we reach here, neither valid admin nor user
    res.status(401).json({ message: 'Not authorized, invalid or missing token' });
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
router.get('/:id', protectBoth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            // Check authorization
            const isUserOwner = req.user && req.user._id.toString() === order.user._id.toString();
            const isAdmin = !!req.admin;

            if (isUserOwner || isAdmin) {
                res.json(order);
            } else {
                res.status(401);
                throw new Error('Not authorized to view this order');
            }
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});



// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
router.put('/:id/status', protectAdmin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (order) {
            const oldStatus = order.status;
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            // Send email if status changed
            if (oldStatus !== order.status && order.user && order.user.email) {
                try {
                    const emailMessage = `
                        <h1>Order Status Update</h1>
                        <p>Hi ${order.user.name || 'Valued Customer'},</p>
                        <p>Your order <strong>#${order._id}</strong> status has been updated to:</p>
                        <h2 style="color: #4A90E2;">${order.status}</h2>
                        <p>You can view your order details in your dashboard.</p>
                        <p>Thank you for shopping with Mazel Tote!</p>
                    `;

                    await sendEmail({
                        email: order.user.email,
                        subject: `Order Updated: ${order.status} - Mazel Tote`,
                        html: emailMessage
                    });
                    console.log(`Status update email sent to ${order.user.email}`);
                } catch (emailError) {
                    console.error('Failed to send status update email:', emailError);
                }
            }

            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

module.exports = router;
