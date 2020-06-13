const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const User = require("../models/userModel").User;
const { multerUploads } = require("../middlewares/multer.js");

// Defining Local Strategy
passport.use(
  "student-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    (res, email, password, done) => {
      User.findOne({ email: email }).then((user) => {
        if (!user) {
          return done(null, false);
        }

        bcrypt.compare(password, user.password, (err, passwordMatched) => {
          if (err) {
            return err;
          }

          if (!passwordMatched) {
            return done(null, false);
          }

          return done(null, user);
        });
      });
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

router.route("/login").post(
  passport.authenticate("student-local", {
    session: true,
  }),
  authController.loginStudent
);

router.route("/register").post(authController.registerStudent);

router.route("/school/register").post(authController.registerSchool);


router.route("/verify").get(authController.verifyStudent);

router.route("/logout").get(authController.logOut);

module.exports = router;
