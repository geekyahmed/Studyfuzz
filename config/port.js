require('dotenv').config()

const config = {
    app:{
        port : process.env.PORT_NUMBER
    }
}

module.exports = config;