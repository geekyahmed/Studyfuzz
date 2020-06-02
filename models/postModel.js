const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'comment'
    }],
    images: {
        type: String,
        default: ''
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    allowComments: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        default: 'public'
    }
})

module.exports = {
    Post: mongoose.model('post', postSchema)
};
