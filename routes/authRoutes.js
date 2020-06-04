const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController')
const passport = require('passport')
const User = require('../models/userModel').User;
const School = require('../models/schoolModel').School;

const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local')


// Defining Local Strategy
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback: true
}, (res, email, password, done) => {
    User.findOne({
        email: email
    }).then(user => {
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
    School.findOne({
        email: email
    }).then(school => {
        if (!school) {
            return done(null, false);
        }

        bcrypt.compare(password, school.password, (err, passwordMatched) => {

            if (!passwordMatched) {
                return done(null, false);
            }
            else{
            return done(null, school);

            }
        });

    });
}));

passport.serializeUser(function (user,done) {
    done(null, user.id);
});

passport.serializeUser(function (school, done) {
    done(null, school.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.deserializeUser(function (id, done) {
    School.findById(id, function (err, school) {
        done(err, school);
    });
});

router.route('/student/register')
    .get(authController.getRegisterStudent)
    .post(authController.registerStudent)

router.route('/student/login')
    .get(authController.getStudentLogin)
    .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/student/login',
        session: true
    }), authController.loginStudent)

router.route('/student/confirm/:token')
    .get(authController.confirmStudentToken)

router.route('/school/register')
    .get(authController.getRegisterSchool)
    .post(authController.registerSchool)

router.route('/school/login')
    .get(authController.getSchoolLogin)
    .post(passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/school/login',
        session: true
    }), authController.loginStudent)

router.route('/school/confirm/:token')
    .get(authController.confirmSchoolToken)


module.exports = router