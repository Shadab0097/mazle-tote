const PromoCode = require('../models/PromoCode');

// @desc    Create a new promo code
// @route   POST /api/promos
// @access  Private/Admin
const createPromo = async (req, res) => {
    try {
        const { code, discountAmount, maxUses } = req.body;

        const promoExists = await PromoCode.findOne({ code: code.toUpperCase() });
        if (promoExists) {
            return res.status(400).json({ message: 'Promo code already exists' });
        }

        const promo = new PromoCode({
            code: code.toUpperCase(),
            discountAmount,
            maxUses: maxUses || 0,
        });

        const createdPromo = await promo.save();
        res.status(201).json(createdPromo);
    } catch (error) {
        console.error('Error creating promo:', error);
        res.status(500).json({ message: 'Server context error' });
    }
};

// @desc    Get all promo codes
// @route   GET /api/promos
// @access  Private/Admin
const getPromos = async (req, res) => {
    try {
        const promos = await PromoCode.find({}).sort({ createdAt: -1 });
        res.json(promos);
    } catch (error) {
        console.error('Error fetching promos:', error);
        res.status(500).json({ message: 'Server context error' });
    }
};

// @desc    Toggle promo code status (active/inactive)
// @route   PATCH /api/promos/:id/toggle
// @access  Private/Admin
const togglePromoStatus = async (req, res) => {
    try {
        const promo = await PromoCode.findById(req.params.id);

        if (promo) {
            promo.isActive = !promo.isActive;
            const updatedPromo = await promo.save();
            res.json(updatedPromo);
        } else {
            res.status(404).json({ message: 'Promo code not found' });
        }
    } catch (error) {
        console.error('Error toggling promo status:', error);
        res.status(500).json({ message: 'Server context error' });
    }
};

// @desc    Delete a promo code
// @route   DELETE /api/promos/:id
// @access  Private/Admin
const deletePromo = async (req, res) => {
    try {
        const promo = await PromoCode.findById(req.params.id);

        if (promo) {
            await promo.deleteOne();
            res.json({ message: 'Promo code removed' });
        } else {
            res.status(404).json({ message: 'Promo code not found' });
        }
    } catch (error) {
        console.error('Error deleting promo:', error);
        res.status(500).json({ message: 'Server context error' });
    }
};

// @desc    Validate a promo code for users during checkout
// @route   POST /api/promos/validate
// @access  Public
const validatePromo = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ message: 'Promo code is required' });
        }

        const promo = await PromoCode.findOne({ code: code.toUpperCase() });

        if (!promo) {
            return res.status(404).json({ message: 'Invalid promo code' });
        }

        if (!promo.isActive) {
            return res.status(400).json({ message: 'This promo code is no longer active' });
        }

        if (promo.maxUses > 0 && promo.uses >= promo.maxUses) {
            return res.status(400).json({ message: 'This promo code has reached its usage limit' });
        }

        res.json({
            code: promo.code,
            discountAmount: promo.discountAmount,
            message: 'Promo code applied successfully',
        });
    } catch (error) {
        console.error('Error validating promo code:', error);
        res.status(500).json({ message: 'Server context error' });
    }
};

module.exports = {
    createPromo,
    getPromos,
    togglePromoStatus,
    deletePromo,
    validatePromo,
};
