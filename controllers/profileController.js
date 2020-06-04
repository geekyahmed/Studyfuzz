const User = require('../models/userModel').User

module.exports = {
    getUser: async (req, res, next) => {
        try {
            const userId = req.params.userId;
            const user = await User.findById(userId);
            if (!user) {
                return next(new Error('User does not exist'));
            } else {
                res.status(200).json({
                    data: user
                });
            }
        } catch (error) {
            next(error)
        }
    },
    grantAccess: (action, resource)=> {
        return async(req, res, next)=> {
            try {
                const permission = roles.can(req.user.role)[action](resource);
                if (!permission.granted) {
                    return res.status(401).json({
                        error: "You don't have enough permission to perform this action"
                    });
                }
                next()
            } catch (error) {
                next(error)
            }
        }
    }
}