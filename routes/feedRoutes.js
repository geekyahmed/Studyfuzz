const express = require('express')
const router = express.Router();
const feedController = require('../controllers/feedController')

router.route('/')
    .get(feedController.getUsers)



module.exports = router