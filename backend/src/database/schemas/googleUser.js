const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: new Date(),
    },
});

module.exports = mongoose.model('google_users', googleUserSchema);