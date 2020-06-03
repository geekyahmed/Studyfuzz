const passport = require('passport')
const LocalStrategy = require('passport-local')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel').User
const Token = require('../models/tokenModel').Token


module.exports = {
    getRegister: (req, res) => {
        res.render('index/register')
    },
    registerUser: (req, res) => {
        const username = req.body.username;
        const fullname = req.body.fullname;
        const email = req.body.email;
        const password = req.body.password; {
            User.findOne({
                email: email,
                username: username
            }).then(function (currentUser) {
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
                                const token = new Token({
                                    _userId: user._id,
                                    token: crypto.randomBytes(16).toString('hex')
                                })
                                token.save((err) => {
                                    if (err) {
                                        res.status(500).send({
                                            msg: err.message
                                        })
                                    } else {
                                        var transporter = nodemailer.createTransport({
                                            service: 'Gmail',
                                            auth: {
                                                user: process.env.GMAIL_USER,
                                                pass: process.env.GMAIL_PASS
                                            }
                                        })
                                        var mailOptions = {
                                            from: 'no-reply@studyfuzz.com',
                                            to: user.email,
                                            subject: 'Verify Your Account',
                                            text: 'Hello there ,\n\n ' + 'Please verify your account to be a part of study fuzz by clicking this link: \nhttp:\/\/' + req.headers.host + '\/confirmation' + token.token + '.\n'
                                        }
                                        transporter.sendMail
                                        (mailOptions, (err)=> {
                                                if(err){
                                                    res.status(500).send({msg: err.message})
                                                }
                                                else{
                                                    res.status(200).send('A verification email has been sent to  '+ user.email)
                                                }
                                        })
                                    }
                                })
                                res.redirect('/login');
                            });
                        });
                    });
                }
            });

        }
    },
    confirmToken:(req, res)=>{
        Token.findOne({token: req.body.token}, (err, token)=>{
            if(!token){
                res.status(400).send({ type: 'not-verified', msg: 'Unable to find a valid token' })
            }
            else{
                User.findOne({_id: token._userId, email: req.body.email}, (err, user)=> {
                    if(!token){
                        return res.status(400).send({msg: 'Unable to find a user for this token'})
                    }
                    if(user.isVerified){
                        return res.status(400).send({type: 'already-veriiied', msg: 'This user has been verified'})
                    }
                    else{
                        user.isVerified = true;
                        user.save((err)=> {
                            if(err){
                                return res.status(500).send({msg: err.message })
                            }
                            else{
                                res.satus(200).send('The account has been verified')
                            }
                        })
                    }
                })
            }
        })
    },
    getLogin: (rea, res) => {
        res.render('index/login')
    },
    loginUser: (req, res) => {
        if (!user.isVerified) {
            res.status(401).json({
                type: 'not- verified',
                msg: 'Your account has not been verified'
            })
        }
        res.redirect('/discover', {
            token: generateToken(user),
            user: user
        });
    },
    getLogout: (req, res) => {
        req.logout();

        res.redirect('/login')
    }
}