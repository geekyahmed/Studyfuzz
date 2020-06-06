require("dotenv").config();
const nodemailer = require("nodemailer");
const crypto = require("crypto");
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
            res.json({ msg: "This user has already been registered" });
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
                    token: crypto.randomBytes(16).toString("hex"),
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
                          "/confirm/" +
                          token.token +
                          ".\n",
                      };
                      transporter.sendMail(mailOptions, (err) => {
                        if (err) {
                          console.log(err);
                        } else {
                          res.json({
                            msg: "Verification link sent to" + user.email,
                          });
                        }
                      });
                    }
                  });
                  res.json({ msg: "You have successfully registered in" });
                });
              });
            });
          }
        });
    }
  },
  registerSchool: (req, res) => {
    const name = req.body.name;
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
            res.json({ msg: "This school has already been registered" });
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
                  res.json({ msg: "This school has been registered" });
                });
              });
            });
          }
        });
    }
  },
  confirmStudentToken: (req, res) => {
    const token = req.params.id;
    const tokenVerified = !!req.body.isVerified;
    Token.findById(token, (token) => {
      if (!token) {
        return res.status(400).send({
          type: "not-verified",
          msg: "Unable to find a valid token",
        });
      } else {
        User.findOne(
          {
            id: token._userId,
          },
          (user) => {
            if (!token) {
              return res.status(400).json({
                msg: "Unable to find a user for this token",
              });
            }
            if (tokenVerified) {
              return res.status(400).json({
                type: "already-verified",
                msg: "This user has been verified",
              });
            } else
              (user) => {
                isVerified = tokenVerified;
                user.save((err) => {
                  if (err) {
                    return res.status(500).json({
                      msg: err.message,
                    });
                  } else {
                    res
                      .status(200)
                      .json({ msg: "The account has been verified" });
                  }
                });
              };
          }
        );
      }
    });
  },
  loginStudent: (req, res) => {
    if (!user.isVerified) {
      return res.status(401).json({
        type: "not- verified",
        msg: "Your account has not been verified",
      });
    }
    res.json({
      token: generateToken(user),
      user: user,
      role: user.role,
    });
  },

  logOut: (req, res) => {
    req.logout();

    res.json({ msg: "You have successfully logged out" });
  },
};
