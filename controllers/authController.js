require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel").User;
const School = require("../models/schoolModel").School;
const Token = require("../models/tokenModel").Token;

module.exports = {
  registerStudent: (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const role = req.body.role;
    let filename = "";
    if (req.files) {
      let file = req.files.uploadedFile;
      filename = file.name;
      let uploadDir = "./public/uploads/";
      file.mv(uploadDir + filename, (err) => {
        if (err) throw err;
      });
    }
    const email = req.body.email;
    const password = req.body.password;
    {
      User.findOne({
        email: email,
        username: username,
        role: role || "student",
      })
        .select("-password")
        .then(function (currentUser) {
          if (currentUser) {
            res.send({
              msg: "This user has already been registered",
            });
          } else {
            const newUser = new User({
              name: name,
              email: email,
              username: username,
              password: password,
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newUser.password, salt, (err, hash) => {
                newUser.password = hash;
                newUser.save().then((user) => {
                  const token = new Token({
                    _userId: user._id,
                    token: crypto.randomBytes(17).toString("hex"),
                  });
                  token.save((err) => {
                    if (err) {
                      return res.status(500).send({
                        msg: err.message,
                      });
                    } else {
                      var transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                          user: process.env.GMAIL_USER,
                          pass: process.env.GMAIL_PASS,
                        },
                      });
                      const mailOptions = {
                        from: "Study Fuzz <no-reply@studyfuzz.com>",
                        to: user.email,
                        subject: "Verify Your Account",
                        text:
                          "Hello there ,\n\n " +
                          "Please verify your account to be a part of study fuzz by clicking this link: \nhttp://" +
                          req.headers.host +
                          "/api/verify/" +
                          token.token +
                          ".\n",
                      };
                      transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                           console.log(err);
                        } else {
                          return res.send({
                            msg: "Verification link sent to" + user.email,
                          });
                        }
                      });
                    }
                  });
                  return res.send({
                    msg: "You have successfully registered ",
                    token:
                      "https://" +
                      req.headers.host +
                      "/api/verify/" +
                      token.token,
                  });
                });
              });
            });
          }
        });
    }
  },
  registerSchool: (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone_number = req.body.phone_number;
    const password = req.body.password;
    const country = req.body.country;
    const city = req.body.city;
    const bio = req.body.bio;
    const website = req.body.website;
    const facebook = req.body.facebook;
    const twitter = req.body.twitter;
    {
      School.findOne({
        email: email,
        phone_number: phone_number,
        country: country,
        city: city,
        bio: bio,
        website: website,
        facebook: facebook,
        twitter: twitter,
      })
        .select("-password")
        .then(function (currentSchool) {
          if (currentSchool) {
            return res.send({
              msg: "This school has already been registered",
            });
          } else {
            const newSchool = new School({
              name: name,
              email: email,
              phone_number: phone_number,
              password: password,
              country: country,
              city: city,
              bio: bio,
              website: website,
              facebook: facebook,
              twitter: twitter,
            });
            bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(newSchool.password, salt, (err, hash) => {
                newSchool.password = hash;
                newSchool.save().then((school) => {
                  return res.status(200).send({
                    msg: "This school has been registered",
                  });
                });
              });
            });
          }
        });
    }
  },
  confirmStudentToken: (req, res) => {
    Token.findOne(
      {
        token: req.body.token,
      },
      (token) => {
        if (!token) {
          return res.status(400).send({
            type: "not-verified",
            msg: "Unable to find a valid token",
          });
        } else {
          User.findOne(
            {
              _id: token._userId,
              email: req.body.email,
            },
            (user) => {
              if (!user) {
                return res.status(400).send({
                  msg: "Unable to find a user for this token",
                });
              }
              if (user.isVerified) {
                return res.status(400).send({
                  type: "already-verified",
                  msg: "This user has been verified",
                });
              } else {
                isVerified = true;
                user.save((err) => {
                  if (err) {
                    return res.status(500).send({
                      msg: err.message,
                    });
                  } else {
                    res.status(200).send({
                      msg: "The account has been verified",
                    });
                  }
                });
              }
            }
          );
        }
      }
    );
  },
  loginStudent: (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
      if (!user) {
        return res
          .status(400)
          .send({
            msg:
              "This email address " + req.body.email + "has already been used",
          });
      }
      if (!user.isVerified) {
        return res.send({
          type: "not-verified",
          msg: "Your account has not been verified",
        });
      } else {
        return res.send({ token: generateToken(user), user: user.toJSON() });
      }
    });
  },

  logOut: (req, res) => {
    req.logout();

    res.json({
      msg: "You have successfully logged out",
    });
  },
};
