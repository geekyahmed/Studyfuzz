const passport = require('passport')
const LocalStrategy = require('passport-local')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

module.exports = {
    postRegister: (req, res) => {
        const firstName = req.body.firstName;
        const username = req.body.username;
        const lastName = req.body.lastName;
        const email = req.body.email;
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        {
            User.findOne({ email: email, username: username }).then(function (currentUser) {
                if (currentUser) {
                    console.log('user is already registered:', currentUser);
                    res.redirect('/register')
                } else {
                    const newUser = new User({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        username: username,
                        password: password
                    });
                     bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });

            passport.use(new LocalStrategy(
                function (username, password, done) {
                    User.findOne({
                        username: username
                    }, function (err, user) {
                        if (err) {
                            return done(err);
                        }
                        if (!user) {
                            return done(null, false);
                        }
                        if (user.password != password) {
                            return done(null, false);
                        }
                        return done(null, user);
                    });
                }
            ));
            passport.serializeUser(function (user, done) {
                done(null, user.id);
            });
            passport.deserializeUser(function (id, done) {
                User.findById(id, function (err, user) {
                    done(err, user);
                });
            });
        }
    },
    postLogin: (req, res) => {
        passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login' }),
            function (req, res) {
                res.redirect('/login');
            }
    },
    getLogout: (req, res ) => {
        req.logout();

        res.redirect('/login')
    }
}