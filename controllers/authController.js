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

        }
    },
    getLogin: (rea, res)=> {
        res.render('index/login')
    },
    postLogin: (req, res) => {
        passport.authenticate('local', { successRedirect: 'user/feeds', failureRedirect: 'index/login' }),
            function (req, res) {
                res.redirect('/login');
            }
    },
    getLogout: (req, res ) => {
        req.logout();

        res.redirect('/login')
    }
}