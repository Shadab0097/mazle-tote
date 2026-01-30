const express = require('express');
const authRouter = express.Router(); // User renamed this to authRouter
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const client = require('../config/oauth');
const { protect } = require('../middlewares/userAuth.middleware');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
authRouter.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const userExists = await User.findOne({ email });

        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            const token = generateToken(user._id, 'user');

            // Set Cookie
            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict', // or 'lax' depending on requirements
            });

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'Registered successfully',
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
authRouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            const token = generateToken(user._id, 'user');

            // Set Cookie
            res.cookie('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                message: 'Logged in successfully',
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
        res.status(statusCode).json({ message: error.message });
    }
});

// @desc    Google Auth
// @route   POST /api/auth/google
// @access  Public
authRouter.post('/google', async (req, res) => {
    try {
        const { token: googleToken } = req.body; // renamed to avoid confusion
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, sub } = ticket.getPayload();

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name,
                email,
                password: sub + process.env.JWT_SECRET, // Dummy password
            });
        }

        const token = generateToken(user._id, 'user');

        // Set Cookie
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        });

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            message: 'Google login successful',
        });
    } catch (error) {
        res.status(400).json({ message: 'Google Auth Failed: ' + error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
authRouter.get('/me', protect, async (req, res) => {
    try {
        const user = {
            _id: req.user._id,
            name: req.user.name,
            email: req.user.email,
        };
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
authRouter.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Forgot password - send reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const crypto = require('crypto');

authRouter.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'No user found with that email' });
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        // Save the user (this saves the hashed token and expiry)
        await user.save({ validateBeforeSave: false });

        // In a real application, you would send an email here with the reset link
        // For now, we'll return the token in the response (development only)
        const resetUrl = `${req.protocol}://${req.get('host').replace(':5000', ':5173')}/reset-password/${resetToken}`;

        // For production, you would use a mail service like nodemailer, SendGrid, etc.
        // await sendEmail({ email: user.email, subject: 'Password Reset', message: resetUrl });

        res.status(200).json({
            success: true,
            message: 'Password reset link has been sent to your email',
            // Remove resetUrl in production - only for development testing
            resetUrl: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
        });
    } catch (error) {
        // If error, clear the reset token fields
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
        }
        res.status(500).json({ message: 'Email could not be sent' });
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
authRouter.put('/reset-password/:resetToken', async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resetToken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now log in with your new password.',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = authRouter;
