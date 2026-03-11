const express = require('express');
const Charity = require('../models/Charity');
const { protectAdmin } = require('../middlewares/adminAuth.middleware');

const router = express.Router();

// @desc    Get all charities
// @route   GET /api/charities
// @access  Public
router.get('/', async (req, res) => {
    try {
        const charities = await Charity.find({}).sort({ createdAt: 1 });
        res.json(charities);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch charities' });
    }
});

// @desc    Create a charity
// @route   POST /api/charities
// @access  Private (Admin)
router.post('/', protectAdmin, async (req, res) => {
    try {
        const { name, description, amount, link, iconName } = req.body;
        const charity = await Charity.create({ name, description, amount, link, iconName });
        res.status(201).json(charity);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create charity' });
    }
});

// @desc    Update a charity
// @route   PUT /api/charities/:id
// @access  Private (Admin)
router.put('/:id', protectAdmin, async (req, res) => {
    try {
        const charity = await Charity.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!charity) {
            return res.status(404).json({ message: 'Charity not found' });
        }
        res.json(charity);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update charity' });
    }
});

// @desc    Delete a charity
// @route   DELETE /api/charities/:id
// @access  Private (Admin)
router.delete('/:id', protectAdmin, async (req, res) => {
    try {
        const charity = await Charity.findByIdAndDelete(req.params.id);
        if (!charity) {
            return res.status(404).json({ message: 'Charity not found' });
        }
        res.json({ message: 'Charity deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete charity' });
    }
});

module.exports = router;
