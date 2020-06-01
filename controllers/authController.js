const passport = require('passport')
const LocalStrategy = require('passport-local')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

module.exports = {
    getRegister: (req, res)=> {
        res.render('index/register')
    },
    postRegister: (req, res) => {
        const username = req.body.username;
        const fullname = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password;
        {
            User.findOne({ email: email, username: username }).then(function (currentUser) {
                if (currentUser) {
                    console.log('user is already registered:', currentUser);
                    res.redirect('/register')
                } else {
                    const newUser = new User({
                        fullname: fullname,
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