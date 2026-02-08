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

// ... (middleware content omitted for brevity)

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
