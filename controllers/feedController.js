const School = require("../models/schoolModel").School;
const User = require("../models/userModel").User;
const ObjectId = require("mongoose").Types.ObjectId;

module.exports = {
  
  //Fetch  All  Students
  getSchools: async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    try {
      const schools = await School.find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const countSchools = await School.countDocuments();

      return res.send({
        schools,
        totalPages: Math.ceil(countSchools / limit),
        currentPage: page,
      });
    } catch (err) {
      console.error(err.message);
    }
  },

  //Fetch  All  Students
  getStudents: async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    //
    try {
      const students = await User.find()
        .select("-password")
        .lean()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const countStudents = await User.countDocuments();

      return res.send({
        students: students,
        totalPages: Math.ceil(countStudents / limit),
        currentPage: page,
      });
    } catch (err) {
      console.error(err.message);
    }
  },

  //Get Single Student Profile By Username
  getSingleStudent: (req, res, next) => {
    const id = req.params.id;
    const $or = [{ username: id }];

    if (ObjectId.isValid(id)) {
      $or.push({ _id: ObjectId(id) });
    }
    User.find({ $or: $or })
      .select("-password")

      .exec((err, user) => {
        if (!user) {
          return res.send({ msg: "Sorry, Student Not Found" });
        }
        return res.send(user);
      });
  },

  //Get Single School Profile By Username
  getSingleSchool: (req, res, next) => {
    const id = req.params.id;
    const $or = [{ slug: id }];

    if (ObjectId.isValid(id)) {
      $or.push({ _id: ObjectId(id) });
    }
    School.find({ $or: $or })
      .select("-password")

      .exec((err, school) => {
        if (!school) {
          return res.send({ msg: "Sorry, School Not Found" });
        }
        return res.send(school);
      });
  },
};
