const Task = require('../models/taskModel').Task

module.exports= {
    createTask: (req, res)=> {
        const title = req.body.title;
        const description = req.body.description;
        const  tags = req.body.tags;

        Task.create({
            title: title,
            description: description,
            tags : tags
        })
        .then(product => {
            return res.send({msg: product.title + 'This task has been created'})
        })
        .catch(err => {
            console.log(err)
        })
    },

}