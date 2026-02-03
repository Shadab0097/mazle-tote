const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        guestEmail: {
            type: String,
        },
        items: [
            {
                name: { type: String, required: true },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'Product',
                },
            },
        ],
        shippingAddress: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
        },
        charityTrust: {
            type: String,
            required: true,
            enum: [
                'StandWithUs',
                'Combat Campus Antisemitism',
                'Blue Square Alliance',
                'Green Earth Foundation',
                'Children Education Trust',
                'Animal Welfare Society'
            ],
        },
        payment: {
            method: { type: String, required: true },
            paymentId: { type: String },
            status: { type: String, default: 'Pending' },
        },
        // PayPal Order ID for duplicate detection
        paypalOrderId: {
            type: String,
            index: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            default: 0.0,
        },
        status: {
            type: String,
            required: true,
            default: 'AwaitingPayment',
            enum: ['AwaitingPayment', 'Paid', 'PaymentFailed', 'Cancelled', 'Shipped', 'Delivered'],
        },
        // Track payment attempts for analytics
        paymentAttempts: {
            type: Number,
            default: 0,
        },
        // Order expires after 30 minutes if not paid
        expiresAt: {
            type: Date,
            default: () => new Date(Date.now() + 30 * 60 * 1000),
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);
