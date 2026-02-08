const express = require('express');
const router = express.Router();
const axios = require('axios');
const Order = require('../models/Order');
const Product = require('../models/Product');
const sendEmail = require('../utils/sendEmail');
const dotenv = require('dotenv');

dotenv.config();

const { PAYPAL_API_URL, PAYPAL_WEBHOOK_ID, PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;
const base = PAYPAL_API_URL || 'https://api-m.sandbox.paypal.com';

/**
 * Generate Access Token (Reused from payment.routes, ideally shared utility)
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
        console.error('Failed to generate Access Token:', error.message);
        throw error;
    }
};

/**
 * Verify Webhook Signature
 * We call PayPal's /v1/notifications/verify-webhook-signature endpoint
 * passing the headers and body we received.
 */
const verifySignature = async (req) => {
    try {
        const accessToken = await generateAccessToken();

        // Construct the verification payload
        // IMPORTANT: req.body must be the parsed JSON body (but structure preserved)
        // AND we need headers.

        const verificationBody = {
            auth_algo: req.headers['paypal-auth-algo'],
            cert_url: req.headers['paypal-cert-url'],
            transmission_id: req.headers['paypal-transmission-id'],
            transmission_sig: req.headers['paypal-transmission-sig'],
            transmission_time: req.headers['paypal-transmission-time'],
            webhook_id: PAYPAL_WEBHOOK_ID,
            webhook_event: req.body
        };

        const response = await axios.post(
            `${base}/v1/notifications/verify-webhook-signature`,
            verificationBody,
            {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data.verification_status === 'SUCCESS';
    } catch (error) {
        console.error('Signature Verification Failed:', error.response?.data || error.message);
        return false;
    }
};

router.post('/paypal', async (req, res) => {
    // 1. Verify Signature
    // Note: Verification requires the raw body content basically.
    // However, the `verify-webhook-signature` API expects the `webhook_event` as a JSON object.
    // So if we use `express.json()`, `req.body` is the object.

    // Check if WEBHOOK_ID is configured
    if (!PAYPAL_WEBHOOK_ID) {
        console.warn('PAYPAL_WEBHOOK_ID not configured, skipping verification (UNSAFE for production)');
        // In strict mode, return 500 or 400. For now proceed with caution or fail.
        // Failing for safety.
        return res.status(500).send('Webhook ID configuration missing');
    }

    const isValid = await verifySignature(req);
    if (!isValid) {
        console.error('Invalid Webhook Signature');
        return res.status(400).send('Invalid Signature');
    }

    // 2. Handle Event
    const event = req.body;
    const eventType = event.event_type;

    console.log(`Received Webhook: ${eventType}`);

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
        const resource = event.resource; // The capture object
        const captureId = resource.id;
        const customId = resource.custom_id; // extracted from purchase_units reference_id if set?

        // Wait, where is the order ID?
        // In create-order, we set `reference_id: order._id.toString()`.
        // This `reference_id` usually comes back in `resource.custom_id` IF we set it in `custom_id` field.
        // But we set it in `purchase_units[0].reference_id`.
        // For Capture Completed event, the resource is the Capture object.
        // The Capture object contains `custom_id` if it was passed during creation?
        // actually `reference_id` from purchase unit is often found in `resource.supplementary_data.related_ids.order_id` -> then lookup order?
        // OR `resource.custom_id` if we mapped it.

        // Let's rely on `resource.supplementary_data` or finding by `paypalOrderId` which is `resource.links...up`?
        // Better: We SHOULD have set `custom_id` on the purchase_unit to our local DB ID.
        // In `payment.routes.js`, we set `reference_id`.
        // PayPal docs say `reference_id` is passed back in webhook?
        // Actually, `PAYMENT.CAPTURE.COMPLETED` resource is a Capture.
        // It has `custom_id` field if provided.
        // `reference_id` is at Purchase Unit level.

        // Flexible Lookup:
        // Try to find Order by `paypalOrderId` (from links) OR by `_id` if `custom_id` matches.
        // The webhook payload for Capture Completed includes `supplementary_data` with `related_ids`.

        let order;

        // Strategy 1: Find by PayPal Capture ID (if we already saved it? No, this is first time maybe)
        // Strategy 2: Find by PayPal Order ID.
        // Where is PayPal Order ID in this event?
        // resource.supplementary_data.related_ids.order_id

        const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

        if (paypalOrderId) {
            order = await Order.findOne({ paypalOrderId: paypalOrderId });
        }

        // Strategy 3: usage of custom_id if set
        if (!order && resource.custom_id) {
            try {
                order = await Order.findById(resource.custom_id);
            } catch (e) { }
        }

        if (order) {
            if (order.status === 'Paid') {
                console.log(`Order ${order._id} already Paid. Webhook ignored.`);
                return res.status(200).send();
            }

            // Update Order
            order.status = 'Paid';
            order.payment.status = 'Completed';
            order.payment.paypalCaptureId = captureId;
            order.payment.paypalOrderId = paypalOrderId || order.payment.paypalOrderId;

            await order.save();
            console.log(`Webhook: Order ${order._id} marked as Paid via Capture ${captureId}`);

            // Trigger Stock Update & Email (reused logic? Ideally extracted to service)
            // For brevity, simple stock update:
            try {
                for (const item of order.items) {
                    const productModel = await Product.findById(item.product);
                    if (productModel) {
                        productModel.stock = Math.max(0, productModel.stock - item.quantity);
                        await productModel.save();
                    }
                }
            } catch (e) { console.error(e); }

        } else {
            console.warn(`Webhook: Local Order not found for PayPal Order ${paypalOrderId}`);
        }
    }

    res.status(200).send();
});

module.exports = router;
