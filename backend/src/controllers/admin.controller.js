const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });

        if (admin && (await admin.matchPassword(password))) {
            res.json({
                _id: admin._id,
                name: admin.name,
                email: admin.email,
                permissions: admin.permissions,
                token: generateToken(admin._id, 'admin'),
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(401).json({ message: error.message });
    }
};

// @desc    Get Admin Data
// @route   GET /api/admin/me
// @access  Private (Admin)
const getAdminMe = async (req, res) => {
    try {
        const admin = {
            _id: req.admin._id,
            name: req.admin.name,
            email: req.admin.email,
            permissions: req.admin.permissions,
        };
        res.json(admin);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    loginAdmin,
    getAdminMe,
};
