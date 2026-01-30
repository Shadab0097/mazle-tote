const express = require('express');
const router = express.Router();
const { subscribe, getAllSubscribers, sendBulkEmail } = require('../controllers/subscriber.controller');
const { protectAdmin } = require('../middlewares/adminAuth.middleware');

// Public route - Subscribe
router.post('/subscribe', subscribe);

// Admin routes - Get all & Send Bulk
router.get('/', protectAdmin, getAllSubscribers);
router.post('/send-bulk', protectAdmin, sendBulkEmail);

module.exports = router;
