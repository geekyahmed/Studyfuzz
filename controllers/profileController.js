const User = require('../models/userModel').User

module.exports = {
     showFollows: (req, res) => {
         let id = req.params.id
        if(req.user){
             User.findOne({
                 '_id': id
             }, (err, user) => {
                 if (err) {
                     return res.json(err)
                 } else {
                     res.render('user/profile', {})
                 }
             })
        }
     }
}