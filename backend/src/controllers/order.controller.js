const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (User)
const createOrder = async (req, res) => {
    try {
        const {
            items,
            shippingAddress,
            payment,
            totalAmount,
        } = req.body;

        if (items && items.length === 0) {
            res.status(400);
            throw new Error('No order items');
        } else {
            const order = new Order({
                user: req.user._id,
                items,
                shippingAddress,
                payment,
                totalAmount,
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get All Orders (Admin)
// @route   GET /api/orders
// @access  Private (Admin)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private (User)
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'images') // Populate product images
            .sort({ createdAt: -1 }); // Sort by newest first
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private (User/Admin)
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate(
            'user',
            'name email'
        );

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
        res.status(404).json({ message: error.message });
    }
};


// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
};
