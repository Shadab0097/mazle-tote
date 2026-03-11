const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: '',
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
        link: {
            type: String,
            default: '',
        },
        iconName: {
            type: String,
            default: 'heart',
            enum: ['heart', 'globe', 'book', 'shield', 'sun'],
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Charity', charitySchema);
