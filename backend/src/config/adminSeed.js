const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./db');
const Admin = require('../models/Admin');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        const adminExists = await Admin.findOne({ email: 'admin@example.com' });

        if (adminExists) {
            console.log('Admin already exists');
            process.exit();
        }

        const admin = new Admin({
            name: 'Super Admin',
            email: 'admin@example.com',
            password: 'password123', // Will be hashed by pre-save middleware
            permissions: ['products', 'orders'],
        });

        await admin.save();

        console.log('Admin Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();
