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
        type: String
    },
    creationDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = Post = mongoose.model('posts', postSchema)