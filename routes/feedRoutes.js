const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");

router.route("/schools").get(feedController.getSchools);

router.route("/students").get(feedController.getStudents);

module.exports = router;
