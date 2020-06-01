const express = require('express')
const router = express.Router();
const postController = require('../controllers/postController')
const {isUserAuthenticated} = require('../middlewares/auth')

router.route('/*', isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = 'user';

    next();
});


router.route('/feeds')
    .get(postController.getCreatePost)
    .post(postController.createPost)

module.exports = router