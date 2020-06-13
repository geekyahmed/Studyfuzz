const express = require('express')
const profileController = require('../controllers/profileController')
const roles = require('../middlewares/roles')
const router = express.Router()
const {isUserAuthenticated} = require('../middlewares/auth')


router.all("/*", isUserAuthenticated, (req, res, next) => {
  next();
});

router.route('/profile')
    .get(profileController.getProfile)

    module.exports = router;