module.exports = {
  isUserAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      return res.send({ msg: "You are not authenticated" });
    }
  },
};
