const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { errorHandler } = require('./middlewares/error.middleware');
const cookieParser = require('cookie-parser');

// Routes
const authRouter = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');
const productRouter = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const paymentRoutes = require('./routes/payment.routes');
const contactRoutes = require('./routes/contact.routes');
const uploadRoutes = require('./routes/upload.routes');
const subscriberRoutes = require('./routes/subscriber.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

/* ---------------------------------------------------
   🔐 PAYPAL WEBHOOK (RAW BODY — MUST COME FIRST)
--------------------------------------------------- */
app.use(
    '/api/webhooks/paypal',
    express.raw({ type: 'application/json' })
);

/* ---------------------------------------------------
   🌐 NORMAL JSON PARSER (AFTER WEBHOOK)
--------------------------------------------------- */
app.use(express.json());

/* ---------------------------------------------------
   🌍 CORS (NOT FOR WEBHOOKS)
--------------------------------------------------- */
const allowedOrigins = [
    'https://mazle-tote.pages.dev',
    'https://www.mazle-tote.pages.dev',
    'http://localhost:5173',
    process.env.FRONTEND_URL,
    process.env.ALLOW_CORS_ORIGIN
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        if (process.env.NODE_ENV === 'development') {
            return callback(null, origin);
        }

        if (
            allowedOrigins.includes(origin) ||
            origin.endsWith('.mazle-tote.pages.dev')
        ) {
            return callback(null, origin);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

/* ---------------------------------------------------
   🛡️ SECURITY & LOGGING
--------------------------------------------------- */
app.use(helmet({ crossOriginResourcePolicy: false }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(cookieParser());

/* ---------------------------------------------------
   🚏 ROUTES
--------------------------------------------------- */
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/webhooks', webhookRoutes);

/* ---------------------------------------------------
   🏠 BASE
--------------------------------------------------- */
app.get('/', (req, res) => {
    res.send('API is running...');
});

/* ---------------------------------------------------
   ❌ ERROR HANDLER
--------------------------------------------------- */
app.use(errorHandler);

module.exports = app;
