const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();

const protect = async (req, res, next) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            throw new Error('Not authorized, no token');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.type !== 'user') {
            throw new Error('Not authorized, invalid token type');
        }

        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            throw new Error('User not found');
        }

        req.user = user;

        next();
    } catch (error) {
        res.status(401).send('ERROR: ' + error.message);
    }
};

module.exports = { protect };
