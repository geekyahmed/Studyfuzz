function isUserAuthenticated (req, res, next) {
    if(req.isAuthenticated()){
        req.next()
    }
    else{
        res.redirect('/login')
    }
}