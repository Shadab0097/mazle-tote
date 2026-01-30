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

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
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
app.use('/api/upload', uploadRoutes);
app.use('/api/subscribers', subscriberRoutes);

// Base Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling
app.use(errorHandler);

module.exports = app;
