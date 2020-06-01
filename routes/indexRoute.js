const express = require('express')
const router = express.Router();
const authController = require('../controllers/authController')

router.route('/register')
    .get(authController.getRegister)    
    .post(authController.postRegister)

    module.exports = router