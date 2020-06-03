const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followSchema = new Schema({

    follower: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    followee: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    created_at: {
        type: date,
        default: date.now()
    },
    updated_at: {
        type: date,
        default: date.now()
    }

});

module.exports = {
    Follow: mongoose.model('follow', followSchema)
};