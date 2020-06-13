const express = require("express");
const taskController = require("../controllers/taskController");
const profileController = require("../controllers/profileController");
const roles = require("../middlewares/roles");
const router = express.Router();
const { isUserAuthenticated } = require("../middlewares/auth");

router.all("/*", isUserAuthenticated, (req, res, next) => {
  next();
});

router.route("/profile").get(profileController.getProfile);

router.route("/new").post(taskController.createTask);

module.exports = router;
