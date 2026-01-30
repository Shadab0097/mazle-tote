const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const dotenv = require('dotenv');
dotenv.config();

const protectAdmin = async (req, res, next) => {
    try {
        const { adminToken } = req.cookies;

        if (!adminToken) {
            throw new Error('Not authorized, no admin token');
        }

        // Using JWT_SECRET as maintained in the project config
        const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);

        if (decoded.type !== 'admin') {
            throw new Error('Not authorized, invalid token type');
        }

        const admin = await Admin.findById(decoded.id).select('-password');

        if (!admin) {
            throw new Error('Admin not found');
        }

        req.admin = admin; // Keeping req.admin for consistency with rest of app

        next();
    } catch (error) {
        res.status(401).send('ERROR: ' + error.message);
    }
};

module.exports = { protectAdmin };
