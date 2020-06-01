const User = require('../models/userModel')
const Post = require('../models/postModel')

module.exports = {
    createPost: (req, res)=> {
        const newPost = new Post({
            description = req.body.description
        })
    }
}