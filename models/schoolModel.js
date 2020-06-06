const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schoolSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    country: {
        type: String,
    },
    city: {
        type: String,
    },
    bio: {
        type: String,
    },
    website: {
        type: String
    },
    facebook: {
        type: String
    },
    twitter: {
        type: String
    },
    isApproved: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    },
    passwordResetToken: {
        type: String
    },
    passwordResetExpires: {
        type: Date
    }
})

module.exports = {
    School: mongoose.model('school', schoolSchema)
};