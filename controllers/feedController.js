const School = require("../models/schoolModel").School;
const User = require("../models/userModel").User;

module.exports = {
  getSchools: async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const match = {};
    const sort = {};

    if (req.query.isVerfied) {
      match.isVerfied = req.query.isVerified === "true";
    }
    if (req.query.sortBy && req.query.OrderBy) {
      sort[req.query.sortBy] = req.query.OrderBy === "desc" ? -1 : 1;
    }

    try {
      const schools = await School.find()
        .select("-password")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      const countSchools = await School.countDocuments();

      res.json({
        options: {
          sort,
        },
        match,
        schools: schools,
        totalPages: Math.ceil(countSchools / limit),
        currentPage: page,
      });
    } catch (err) {
      console.error(err.message);
    }
  },
  getStudents: async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    try {
      const students = await User.find()
        .select("-password")
        .lean()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      const countStudents = await User.countDocuments();

      res.json({
        match,
        students: students,
        totalPages: Math.ceil(countStudents / limit),
        currentPage: page,
      });
    } catch (err) {
      console.error(err.message);
    }
  },
};
