require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const feedRoutes = require('./routes/feedRoutes')
const port = require('./config/port')
const responseTime = require('response-time')
const morgan = require('morgan')

const db = require('./config/db')
const fileUpload = require('express-fileupload');
const session = require('express-session');
const passport = require('passport');
const {
    variables
} = require('./middlewares/variables')

const app = express();

app.use(morgan('dev'))

//Setting Up Express
app.use(express())
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());

//Setting Up Session
app.use(session({
    resave: true,
    secret: process.env.SESSION_KEY,
    saveUninitialized: true
}))

app.use(fileUpload())

//Setting Up Mongoose
mongoose.connect(db.dbURL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(response => {
        console.log('MongoDB connected succesfully')
    })
    .catch(err => {
        console.log('MongoDB connection failed')
    })

    mongoose.set("useCreateIndex", true);

//Setting up Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(responseTime())

app.use(variables);

app.use('/api/', authRoutes, feedRoutes);



app.listen(port.portID, (req, res) => {
    console.log('Server is running at port ' + port.portID)
})