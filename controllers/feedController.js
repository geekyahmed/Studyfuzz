const User = require('../models/userModel').User
const Post = require('../models/postModel').Post
const Comment = require('../models/commentModel')

module.exports = {

    getFeeds: async (req, res) => {
        // destructure page and limit and set default values
        const {
            page = 1, limit = 20
        } = req.query;

        try {
            // execute query with page and limit values
            const posts = await Post.find()
                .lean()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();

            const users = await User.find()
                .lean()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            // get total documents in the Posts collection
            const countPosts = await Post.countDocuments();
            const countUsers = await User.countDocuments();

            if (req.user) {
                res.render('user/feeds', {
                    posts: posts,
                    users: users,
                    totalPages: Math.ceil(countPosts && countUsers / limit),
                    currentPage: page
                });
            } else {
                res.redirect('/login')
            }
        } catch (err) {
            console.error(err.message);
        }
    }

}