const express = require('express')
const router = express.Router();
const feedController = require('../controllers/feedController')

router.route('/')
    .get(feedController.getSchools)



module.exports = router