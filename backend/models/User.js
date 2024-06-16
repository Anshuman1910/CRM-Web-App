const mongoose = require('mongoose');

// Define the user schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    contact_no: {  // Add the contact number field
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        default: null
    },
    date: {
        type: Date,
        default: Date.now,
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
