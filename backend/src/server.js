const dotenv = require('dotenv');
const connectDB = require('./config/db');
const app = require('./app');
const { startCleanupJob } = require('./jobs/orderCleanup');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);

    // Start background jobs
    startCleanupJob();
});
