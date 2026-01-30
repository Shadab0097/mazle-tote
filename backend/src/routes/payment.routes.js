const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const { protect } = require('../middlewares/userAuth.middleware');
const dotenv = require('dotenv');
const sendEmail = require('../utils/sendEmail');

dotenv.config();

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_URL, PAYPAL_CURRENCY } = process.env;

const base = PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';
const currency = PAYPAL_CURRENCY || 'USD';

/**
 * Generate an OAuth 2.0 access token for the client.
 */
const generateAccessToken = async () => {
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error('MISSING_API_CREDENTIALS');
        }
        const auth = Buffer.from(
            PAYPAL_CLIENT_ID + ':' + PAYPAL_CLIENT_SECRET
        ).toString('base64');
        const response = await axios.post(
            `${base}/v1/oauth2/token`,
            'grant_type=client_credentials',
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Failed to generate Access Token:', error.response?.data || error.message);
        throw new Error('Failed to generate Access Token');
    }
};

/**
 * Get PayPal order details by ID
 */
const getPayPalOrderDetails = async (paypalOrderId) => {
    const accessToken = await generateAccessToken();
    const response = await axios.get(
        `${base}/v2/checkout/orders/${paypalOrderId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    return response.data;
};

// @desc    Create a PayPal Order
// @route   POST /api/payment/paypal/create-order
// @access  Private
router.post('/paypal/create-order', protect, async (req, res) => {
    try {
        const { orderId } = req.body;

        if (!orderId) {
            return res.status(400).json({ message: 'Order ID is required' });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Verify user owns order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // Check if order is already paid
        if (order.status === 'Paid') {
            return res.status(400).json({ message: 'Order is already paid' });
        }

        // Check if order is expired
        if (order.expiresAt && new Date() > order.expiresAt) {
            order.status = 'Cancelled';
            await order.save();
            return res.status(400).json({ message: 'Order has expired. Please create a new order.' });
        }

        // DUPLICATE PREVENTION: Check if order already has a valid PayPal order
        if (order.paypalOrderId) {
            try {
                const existingPayPalOrder = await getPayPalOrderDetails(order.paypalOrderId);
                // If PayPal order is still valid (CREATED or APPROVED), return it
                if (existingPayPalOrder.status === 'CREATED' || existingPayPalOrder.status === 'APPROVED') {
                    console.log(`Returning existing PayPal order ${order.paypalOrderId} for local order ${orderId}`);
                    return res.status(200).json(existingPayPalOrder);
                }
                // If COMPLETED, order was already paid
                if (existingPayPalOrder.status === 'COMPLETED') {
                    order.status = 'Paid';
                    order.payment.status = 'Completed';
                    order.payment.paymentId = existingPayPalOrder.id;
                    await order.save();
                    return res.status(400).json({ message: 'Order is already paid' });
                }
            } catch (e) {
                // PayPal order not found or expired, create new one
                console.log(`Previous PayPal order ${order.paypalOrderId} invalid, creating new one`);
            }
        }

        const totalAmount = order.totalAmount.toFixed(2);

        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const payload = {
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: currency,
                        value: totalAmount,
                    },
                    reference_id: order._id.toString(),
                },
            ],
        };

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Store PayPal order ID and increment attempt counter
        order.paypalOrderId = response.data.id;
        order.paymentAttempts = (order.paymentAttempts || 0) + 1;
        await order.save();

        console.log(`Created PayPal order ${response.data.id} for local order ${orderId} (attempt ${order.paymentAttempts})`);

        res.status(201).json(response.data);
    } catch (error) {
        console.error('Error creating PayPal order:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create PayPal order', details: error.response?.data });
    }
});

// @desc    Capture a PayPal Order
// @route   POST /api/payment/paypal/capture-order
// @access  Private
router.post('/paypal/capture-order', protect, async (req, res) => {
    try {
        const { orderID } = req.body; // PayPal Order ID from client

        if (!orderID) {
            return res.status(400).json({ message: 'PayPal Order ID is required' });
        }

        // First, get PayPal order details to find our local order
        let paypalOrderDetails;
        try {
            paypalOrderDetails = await getPayPalOrderDetails(orderID);
        } catch (e) {
            return res.status(400).json({ message: 'Invalid PayPal order ID' });
        }

        const localOrderId = paypalOrderDetails.purchase_units?.[0]?.reference_id;
        if (!localOrderId) {
            return res.status(400).json({ message: 'Could not find local order reference' });
        }

        const order = await Order.findById(localOrderId);
        if (!order) {
            return res.status(404).json({ message: 'Local order not found' });
        }

        // Verify user owns order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        // DUPLICATE PAYMENT PREVENTION: Check if already paid
        if (order.status === 'Paid') {
            console.log(`Order ${localOrderId} already paid, returning success`);
            return res.status(200).json({
                message: 'Order already paid',
                status: 'COMPLETED',
                orderId: order._id,
                paymentId: order.payment.paymentId
            });
        }

        // Check if PayPal order already completed (webhook or retry scenario)
        if (paypalOrderDetails.status === 'COMPLETED') {
            console.log(`PayPal order ${orderID} already completed, updating local order`);
            order.status = 'Paid';
            order.payment = {
                method: 'PayPal',
                paymentId: orderID,
                status: 'Completed'
            };
            await order.save();
            return res.json(paypalOrderDetails);
        }

        // Capture the payment
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderID}/capture`;

        const response = await axios.post(
            url,
            {},
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const capturedOrder = response.data;

        if (capturedOrder.status === 'COMPLETED') {
            // Payment successful
            order.status = 'Paid';
            order.payment = {
                method: 'PayPal',
                paymentId: capturedOrder.id,
                status: 'Completed'
            };
            await order.save();
            console.log(`Payment captured successfully for order ${localOrderId}`);

            // --- SEND EMAIL NOTIFICATIONS (Fire-and-forget, don't block response) ---
            (async () => {
                try {
                    const orderWithUser = await Order.findById(localOrderId).populate('user', 'email name');
                    const userEmail = orderWithUser.user.email;
                    const adminEmail = process.env.ADMIN_EMAIL;

                    const itemsList = order.items.map(item =>
                        `<li>${item.name} x ${item.quantity} - $${item.price.toFixed(2)}</li>`
                    ).join('');

                    const emailMessage = `
                        <h1>Order Confirmed!</h1>
                        <p>Hi ${orderWithUser.user.name},</p>
                        <p>Thank you for your purchase from Mazel Tote.</p>
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
                        <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
                        <h3>Items:</h3>
                        <ul>${itemsList}</ul>
                        <p>We will notify you when your order ships.</p>
                    `;

                    // 1. Send to Customer
                    await sendEmail({
                        email: userEmail,
                        subject: 'Order Confirmation - Mazel Tote',
                        html: emailMessage
                    });

                    // 2. Send to Admin
                    if (adminEmail) {
                        const adminMessage = `
                            <h1>New Order Received</h1>
                            <p><strong>Order ID:</strong> ${order._id}</p>
                            <p><strong>Customer:</strong> ${orderWithUser.user.name} (${userEmail})</p>
                            <p><strong>Total:</strong> $${order.totalAmount.toFixed(2)}</p>
                            <p>Check the admin dashboard for details.</p>
                        `;
                        await sendEmail({
                            email: adminEmail,
                            subject: `New Order Alert - ${order._id}`,
                            html: adminMessage
                        });
                    }

                    console.log(`Emails sent for order ${localOrderId}`);
                } catch (emailError) {
                    console.error('Failed to send email notifications:', emailError);
                }
            })(); // Execute immediately but don't wait
            // --------------------------------

        } else {
            // Payment not completed
            order.status = 'PaymentFailed';
            order.payment.status = capturedOrder.status;
            await order.save();
            console.log(`Payment not completed for order ${localOrderId}, status: ${capturedOrder.status}`);
            return res.status(400).json({
                message: 'Payment not completed',
                details: capturedOrder
            });
        }

        res.json(capturedOrder);
    } catch (error) {
        console.error('Error capturing PayPal order:', error.response?.data || error.message);

        // Try to update order status to failed
        try {
            const { orderID } = req.body;
            if (orderID) {
                const paypalOrder = await getPayPalOrderDetails(orderID).catch(() => null);
                if (paypalOrder?.purchase_units?.[0]?.reference_id) {
                    await Order.findByIdAndUpdate(
                        paypalOrder.purchase_units[0].reference_id,
                        { status: 'PaymentFailed', 'payment.status': 'Failed' }
                    );
                }
            }
        } catch (e) {
            // Ignore cleanup errors
        }

        res.status(500).json({ error: 'Failed to capture PayPal order', details: error.response?.data });
    }
});

module.exports = router;
