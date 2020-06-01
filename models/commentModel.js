const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({

    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },

    date: {
        type: Date,
        default: Date.now()
    },

    commentIsApproved: {
        type: Boolean,
        default: false
    }


});

module.exports = {
    Comment: mongoose.model('comment', CommentSchema)
};