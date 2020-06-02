const express = require('express')
const router = express.Router();
const postController = require('../controllers/postController')
const feedController = require('../controllers/feedController')
const authController = require('../controllers/authController')

const {
    isUserAuthenticated
} = require('../middlewares/auth')

router.route('/*', isUserAuthenticated, (req, res, next) => {

    req.app.locals.layout = 'user';

    next();
});
router.route('/feeds', async (req, res) => {}
   , isUserAuthenticated)
    .get(feedController.getFeeds)


router.route('/feeds/new', isUserAuthenticated)
    .get(postController.getCreatePost)
    .post(postController.createPost)


router.route('/logout')
    .get(authController.getLogout)

module.exports = router