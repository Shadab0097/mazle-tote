const express = require('express');
const router = express.Router();
const {
    createPromo,
    getPromos,
    togglePromoStatus,
    deletePromo,
    validatePromo,
} = require('../controllers/promo.controller');
const { protectAdmin } = require('../middlewares/adminAuth.middleware');

// Public route for checkout validation
router.post('/validate', validatePromo);

// Admin routes for managing promo codes
router.route('/')
    .post(protectAdmin, createPromo)
    .get(protectAdmin, getPromos);

router.patch('/:id/toggle', protectAdmin, togglePromoStatus);
router.delete('/:id', protectAdmin, deletePromo);

module.exports = router;
