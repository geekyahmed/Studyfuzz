const School = require('../models/schoolModel').School

module.exports = {

    getSchools: async (req, res) => {
        // destructure page and limit and set default values
        const {
            page = 1, limit = 20
        } = req.query;
    const isVerified = req.query.verified;

        const match = {}

        if (req.query.isVerified) {
            match.published = req.query.verified === 'true'
        }

        try {
            // execute query with page and limit values

            const schools = await School.find()
                .lean()
                .limit(limit * 1)
                .skip((page - 1) * limit)
                .exec();
            // get total documents in the Posts collection
            const countSchools = await School.countDocuments();

            res.render('user/feeds', {
                title: 'Study Fuzz - Connecting Students',
                match
                
                schools: schools,
                totalPages: Math.ceil(countSchools / limit),
                currentPage: page
            });
        } catch (err) {
            console.error(err.message);
        }
    }


}