require("dotenv").config({ path: __dirname + "/.env" });

const db = {
    development: {
        connectionString: process.env.MONGODB_URL
    },
    production: {
        connectionString: process.env.MONGOATLAS_URL
    }
}

module.exports = db