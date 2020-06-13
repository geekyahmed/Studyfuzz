const User = require("../models/userModel").User;


module.exports = {
  getProfile: async (req, res, ) => {
    return res.send({ msg: "Welcome to your profile" });
  },
  grantAccess: (action, resource) => {
    return async (req, res, next) => {
      try {
        const permission = roles.can(req.user.role)[action](resource);
        if (!permission.granted) {
          return res.status(401).json({
            error: "You don't have enough permission to perform this action",
          });
        }
        next();
      } catch (error) {
        next(error);
      }
    };
  },
};
