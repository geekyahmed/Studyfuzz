require('dotenv').config()

const db = {
    dbURL : process.env.MONGODB_URL
}

module.exports = db