const express = require("express");
const router = express.Router();
const feedController = require("../controllers/feedController");

router.route("/schools").get(feedController.getSchools);

router.route("/school/:id").get(feedController.getSingleSchool);


router.route("/students").get(feedController.getStudents);

router.route("/:id").get(feedController.getSingleStudent);



module.exports = router;
