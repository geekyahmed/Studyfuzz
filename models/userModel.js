const mongoose = require('mongoose')
const timeAgo = require('node-time-ago')
const Schema = mongoose.Schema

const userSchema = new Schema({
    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    bio: {
        type: String,
    },
    role: {
        type: String,
        default: 'student',
        enum: ['student', 'school', 'admin']
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isOnline: {
        type: Boolean,
        default: true
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
    User: mongoose.model('user', userSchema)
};