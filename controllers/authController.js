require('dotenv').config()
const passport = require('passport')
const LocalStrategy = require('passport-local')
const nodemailer = require('nodemailer')
const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel').User
const School = require('../models/schoolModel').School

const Token = require('../models/tokenModel').Token


module.exports = {
    getRegisterStudent: (req, res) => {
        res.render('index/student_register', {
            title: 'Student-Register To Study Fuzz'
        })
    },
    registerStudent: (req, res) => {
        const fullname = req.body.fullname;
        const username = req.body.username;
        const role = req.body.role;
        let filename = '';
        if (req.files) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }
        const email = req.body.email;
        const password = req.body.password; {
            User.findOne({
                    email: email,
                    username: username,
                    role: role || 'student'
                }).select('-password')
                .then(function (currentUser) {
                    if (currentUser) {
                        console.log('user is already registered:', currentUser);
                        res.redirect('/auth/student/register')
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
                                            return res.status(500).send({
                                                msg: err.message
                                            })
                                        } else {
                                            var transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    user: process.env.GMAIL_USER,
                                                    pass: process.env.GMAIL_PASS
                                                }
                                            })
                                            const mailOptions = {
                                                from: 'Study Fuzz <no-reply@studyfuzz.com>',
                                                to: user.email,
                                                subject: 'Verify Your Account',
                                                text: 'Hello there ,\n\n ' + 'Please verify your account to be a part of study fuzz by clicking this link: \nhttp:\/\/' + req.headers.host + '\/auth\/student\/confirm\/' + token.token + '.\n'
                                            };
                                            transporter.sendMail(mailOptions, (err) => {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    res.json({
                                                        msg: 'Verification link sent to' + user.email
                                                    })
                                                }
                                            })
                                        }
                                    })
                                    res.redirect('/auth/student/login');
                                });
                            });
                        });
                    }
                });

        }
    },
    getRegisterSchool : (req, res)=> {
    res.render('index/school_register', {
        title: 'School-Register To Study Fuzz'
    })
    },
    registerSchool: (req, res) => {
        const name = req.body.name;
        const role = req.body.role;
        let filename = '';
        if (req.files) {
            let file = req.files.uploadedFile;
            filename = file.name;
            let uploadDir = './public/uploads/';
            file.mv(uploadDir + filename, (err) => {
                if (err)
                    throw err;
            });
        }
        const email = req.body.email;
        const phone_number = req.body.phone_number
        const password = req.body.password; {
            School.findOne({
                    email: email,
                    phone_number: phone_number,
                    role: role || 'teacher'
                }).select('-password')
                .then(function (currentSchool) {
                    if (currentSchool) {
                        console.log('school is already registered:', currentSchool);
                        res.redirect('/auth/school/register')
                    } else {
                        const newSchool = new School({
                            name: name,
                            email: email,
                            phone_number : phone_number,
                            password: password
                        });
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(newSchool.password, salt, (err, hash) => {
                                newSchool.password = hash;
                                newSchool.save().then(school => {
                                    const token = new Token({
                                        _userId: school._id,
                                        token: crypto.randomBytes(16).toString('hex')
                                    })
                                    token.save((err) => {
                                        if (err) {
                                            return res.status(500).send({
                                                msg: err.message
                                            })
                                        } else {
                                            var transporter = nodemailer.createTransport({
                                                service: 'gmail',
                                                auth: {
                                                    user: process.env.GMAIL_USER,
                                                    pass: process.env.GMAIL_PASS
                                                }
                                            })
                                            const mailOptions = {
                                                from: 'Study Fuzz <no-reply@studyfuzz.com>',
                                                to: school.email,
                                                subject: 'Verify Your Account',
                                                text: 'Hello there ,\n\n ' + 'Please verify your account to be a part of study fuzz by clicking this link: \nhttp:\/\/' + req.headers.host + '\/auth\/school\/confirm\/' + token.token + '.\n'
                                            };
                                            transporter.sendMail(mailOptions, (err) => {
                                                if (err) {
                                                    console.log(err)
                                                } else {
                                                    res.json({
                                                        msg: 'Verification link sent to' + school.email
                                                    })
                                                }
                                            })
                                        }
                                    })
                                    res.redirect('/auth/school/login');
                                });
                            });
                        });
                    }
                });

        }
    },
    confirmStudentToken: (req, res) => {
        const token = req.params.id;
        const tokenVerified = !!req.body.isVerified
        Token.findById(
            token, (token) => {
                if (!token) {
                    return res.status(400).send({
                        type: 'not-verified',
                        msg: 'Unable to find a valid token'
                    })
                } else {
                    User.findOne({
                        id: token._userId,
                    }, (user) => {
                        if (!token) {
                            return res.status(400).send({
                                msg: 'Unable to find a user for this token'
                            })
                        }
                        if (tokenVerified) {
                            return res.status(400).send({
                                type: 'already-veriiied',
                                msg: 'This user has been verified'
                            })
                        } else(user)=> {
                            isVerified = tokenVerified 
                            user.save((err) => {
                                if (err) {
                                    return res.status(500).send({
                                        msg: err.message
                                    })
                                } else {
                                    res.status(200).send('The account has been verified')
                                }
                            })
                        }
                    })
                }
            })
    },
       confirmSchoolToken: (req, res) => {
           const token = req.params.id;
           const tokenVerified = !!req.body.isVerified
           Token.findById(
               token, (token) => {
                   if (!token) {
                       return res.status(400).send({
                           type: 'not-verified',
                           msg: 'Unable to find a valid token'
                       })
                   } else {
                       School.findOne({
                           id: token._userId,
                       }, (school) => {
                           if (!token) {
                               return res.status(400).send({
                                   msg: 'Unable to find a user for this token'
                               })
                           }
                           if (tokenVerified) {
                               return res.status(400).send({
                                   type: 'already-veriiied',
                                   msg: 'This user has been verified'
                               })
                           } else(school) => {
                               isVerified = tokenVerified
                               school.save((err) => {
                                   if (err) {
                                       return res.status(500).send({
                                           msg: err.message
                                       })
                                   } else {
                                       res.status(200).send('The account has been verified')
                                   }
                               })
                           }
                       })
                   }
               })
       },
    getConfirm: (rea, res) => {
        res.render('index/confirm', {
            title: 'Confirm To Study Fuzz'
        })
    },
    getStudentLogin: (rea, res) => {
        res.render('index/student_login', {
            title: 'Student-Login To Study Fuzz'
        })
    },
    getSchoolLogin: (rea, res) => {
        res.render('index/school_login', {
            title: 'School-Login To Study Fuzz'
        })
    },
    loginStudent: (req, res) => {
        if (!user.isVerified) {
            return res.status(401).json({
                type: 'not- verified',
                msg: 'Your account has not been verified'
            })
        }
        res.redirect('/', {
            token: generateToken(user),
            user: user,
            role: user.role
        });
    },
        loginStudent: (req, res) => {
        if (!user.isVerified) {
            return res.status(401).json({
                type: 'not- verified',
                msg: 'Your account has not been verified'
            })
        }
        res.redirect('/', {
            token: generateToken(user),
            user: user,
            role: user.role
        });
    },
    getLogout: (req, res) => {
        req.logout();

        res.redirect('/')
    }
}