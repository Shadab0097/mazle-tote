const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../src/models/Product');

const fixSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const products = await Product.find({});
        for (const p of products) {
            if (p.slug !== p.slug.trim()) {
                console.log(`Fixing slug for "${p.name}": "${p.slug}" -> "${p.slug.trim()}"`);
                p.slug = p.slug.trim();
                await p.save();
            }
        }

        console.log('Done fixing slugs.');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

fixSlugs();
