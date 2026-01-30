/**
 * Order Cleanup Job
 * Automatically cancels orders that have been in 'AwaitingPayment' status
 * for longer than their expiry time (30 minutes by default).
 */

const Order = require('../models/Order');

const cleanupExpiredOrders = async () => {
    try {
        const result = await Order.updateMany(
            {
                status: 'AwaitingPayment',
                expiresAt: { $lt: new Date() }
            },
            {
                $set: { status: 'Cancelled' }
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`[OrderCleanup] Cancelled ${result.modifiedCount} expired order(s)`);
        }
    } catch (error) {
        console.error('[OrderCleanup] Error cleaning up expired orders:', error);
    }
};

// Run cleanup every 10 minutes
const CLEANUP_INTERVAL = 10 * 60 * 1000; // 10 minutes

const startCleanupJob = () => {
    console.log('[OrderCleanup] Starting expired order cleanup job (runs every 10 minutes)');

    // Run immediately on startup
    cleanupExpiredOrders();

    // Then run periodically
    setInterval(cleanupExpiredOrders, CLEANUP_INTERVAL);
};

module.exports = { cleanupExpiredOrders, startCleanupJob };
