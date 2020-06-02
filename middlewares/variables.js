module.exports = {
    variables: (req, res, next)=> {
        res.locals.user = req.user || null
        next()
    }
}