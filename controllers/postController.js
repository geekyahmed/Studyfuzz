const User = require('../models/userModel')
const Post = require('../models/postModel')
const Comment = require('../models/commentModel')

module.exports = {

    getCreatePost: (req, res) => {
        if (req.user) {
            User.find().then(users => {
                res.redirect('/user/feeds', {
                    user: users
                });
            });
        }
        else {
            res.redirect('/login')
        }
    },
    createPost: (req, res) => {
        const commentsAllowed = req.body.allowComments;
        const newPost = new Post({
            description: req.body.description,
            status: req.body.status,
            allowComments: commentsAllowed
        })
        newPost.save().then(post => {
            res.redirect('/user/feeds')
        })
            .catch(err => {
                res.json({ Error: err })
            })
    }
}