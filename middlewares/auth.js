const jwt = require("jsonwebtoken");

function isUserAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    req.next();
  } else {
    res.redirect("/login");
  }
}
module.exports = (req, res ,)=> {
    try {
      const token = req.headers.authorization.split(" ")[1];
      jwt.verify(token, "longer-secret-is-better");
      next();
    } catch (error) {
      res.status(401).json({ message: "Authentication failed!" });
    }
};
