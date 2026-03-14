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
const charityRoutes = require('./routes/charity.routes');
const promoRoutes = require('./routes/promo.routes');

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
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/* ---------------------------------------------------
   🌍 CORS (NOT FOR WEBHOOKS)
--------------------------------------------------- */
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true); // allow webhooks & curl

        const allowedOrigins = [
            'https://mazeltote.com',
            'https://www.mazeltote.com',
            'https://mazle-tote.pages.dev',
            'http://localhost:5173',
            'http://localhost:3000'
        ];

        if (allowedOrigins.includes(origin)) {
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
app.use('/api/charities', charityRoutes);
app.use('/api/promos', promoRoutes);

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
