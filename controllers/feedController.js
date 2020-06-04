const User = require('../models/userModel').User

module.exports = {

    getUsers: async (req, res) => {
        // destructure page and limit and set default values
        const {
            page = 1, limit = 20
        } = req.query;

        try {
            // execute query with page and limit values

            const users = await User.find()
                .lean()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            // get total documents in the Posts collection
            const countUsers = await User.countDocuments();
            
            if (req.user) {
                res.render('user/feeds', {
                    title: 'Study Fuzz - Connecting Students',
                    users: users,
                    totalPages: Math.ceil(countUsers / limit),
                    currentPage: page
                });
            } else {
                res.redirect('/auth/login')
            }
        } catch (err) {
            console.error(err.message);
        }
    }


}