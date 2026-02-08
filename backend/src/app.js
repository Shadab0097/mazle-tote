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

// Middleware
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
// Debug Middleware to check Origin
app.use((req, res, next) => {
    console.log('Request Origin:', req.headers.origin);
    next();
});

const allowedOrigins = [
    'https://mazle-tote.pages.dev',
    'https://www.mazle-tote.pages.dev',
    'http://localhost:5173',
    'http://localhost:5000',
    process.env.FRONTEND_URL,
    process.env.ALLOW_CORS_ORIGIN // Manual override from env
].filter(Boolean);

// CORS Configuration - Explicitly reflect origin for credentials support
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Development: Allow all origins by reflecting the request origin
        if (process.env.NODE_ENV === 'development') {
            return callback(null, origin); // Reflect origin, not wildcard
        }

        // Production: Strict allowlist
        // Check exact match OR wildcard subdomain match
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.mazle-tote.pages.dev')) {
            callback(null, origin); // Reflect origin, not wildcard
        } else {
            console.log('Blocked by CORS:', origin);
            console.log('Allowed Origins:', allowedOrigins);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Helmet Security Headers (Disabled Cross-Origin Policy for Images/API)
app.use(helmet({
    crossOriginResourcePolicy: false,
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use(cookieParser());

// Routes Mounts
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/upload', uploadRoutes); // Ensure only one instance
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/webhooks', webhookRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling
app.use(errorHandler);

module.exports = app;
