const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Product = require('../src/models/Product');

const checkSlugs = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const products = await Product.find({});
        const output = products.map(p => `Name: "${p.name}", Slug: "${p.slug}", ID: ${p._id}`).join('\n');
        const fs = require('fs');
        fs.writeFileSync('slugs_output.txt', output);
        console.log('Written to slugs_output.txt');

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkSlugs();
