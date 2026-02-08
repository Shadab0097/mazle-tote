const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const Product = require('../models/Product');
const dotenv = require('dotenv');

dotenv.config();

const {
    PAYPAL_API_URL,
    PAYPAL_WEBHOOK_ID,
    PAYPAL_CLIENT_ID,
    PAYPAL_CLIENT_SECRET
} = process.env;

const base = PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

/**
 * Generate PayPal Access Token
 */
const generateAccessToken = async () => {
    const auth = Buffer.from(
        `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
    ).toString('base64');

    const response = await axios.post(
        `${base}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    );

    return response.data.access_token;
};

/**
 * Verify PayPal Webhook Signature (OFFICIAL & SAFE)
 */
const verifySignature = async (req) => {
    try {
        if (!PAYPAL_WEBHOOK_ID) return false;

        const certUrl = req.headers['paypal-cert-url'];

        // 🔐 Cert URL validation (security)
        if (
            !certUrl ||
            (!certUrl.startsWith('https://api.paypal.com') &&
                !certUrl.startsWith('https://api.sandbox.paypal.com'))
        ) {
            console.error('Invalid PayPal cert URL');
            return false;
        }

        const accessToken = await generateAccessToken();

        const rawBody = req.body.toString('utf8');
        const webhookEvent = JSON.parse(rawBody);

        const verificationBody = {
            auth_algo: req.headers['paypal-auth-algo'],
            cert_url: certUrl,
            transmission_id: req.headers['paypal-transmission-id'],
            transmission_sig: req.headers['paypal-transmission-sig'],
            transmission_time: req.headers['paypal-transmission-time'],
            webhook_id: PAYPAL_WEBHOOK_ID,
            webhook_event: webhookEvent
        };

        const response = await axios.post(
            `${base}/v1/notifications/verify-webhook-signature`,
            verificationBody,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.verification_status === 'SUCCESS';
    } catch (err) {
        console.error('Webhook verification failed:', err.message);
        return false;
    }
};

/**
 * PayPal Webhook Endpoint
 */
router.post('/paypal', async (req, res) => {
    try {
        // 1️⃣ Verify Signature
        const isValid = await verifySignature(req);

        if (!isValid) {
            console.warn('Webhook ignored (invalid signature)');
            return res.sendStatus(200); // IMPORTANT: always 200
        }

        // 2️⃣ Parse Event
        const event = JSON.parse(req.body.toString('utf8'));
        const eventType = event.event_type;

        console.log(`Webhook received: ${eventType}`);

        // 3️⃣ Handle Payment Completion
        if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = event.resource;
            const captureId = resource.id;
            const paypalOrderId =
                resource.supplementary_data?.related_ids?.order_id;

            let order = null;

            if (paypalOrderId) {
                order = await Order.findOne({ paypalOrderId });
            }

            // Fallback if custom_id was used
            if (!order && resource.custom_id) {
                try {
                    order = await Order.findById(resource.custom_id);
                } catch (_) { }
            }

            if (!order) {
                console.warn(`Webhook: Order not found for PayPal order ${paypalOrderId}`);
                return res.sendStatus(200);
            }

            // 🛑 Idempotency
            if (order.status === 'Paid') {
                console.log(`Order ${order._id} already Paid. Webhook ignored.`);
                return res.sendStatus(200);
            }

            // 4️⃣ Update Order
            order.status = 'Paid';
            order.payment.method = 'PayPal';
            order.payment.status = 'Completed';
            order.payment.paypalCaptureId = captureId;
            order.payment.paypalOrderId = paypalOrderId;

            await order.save();

            console.log(
                `Webhook success | Order=${order._id} | Capture=${captureId}`
            );

            // 5️⃣ Stock Update (best effort)
            try {
                for (const item of order.items) {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.stock = Math.max(0, product.stock - item.quantity);
                        await product.save();
                    }
                }
            } catch (stockErr) {
                console.error('Stock update failed:', stockErr.message);
            }
        }

    } catch (err) {
        console.error('Webhook handler error:', err.message);
    }

    // ✅ Always acknowledge
    return res.sendStatus(200);
});

module.exports = router;
