require('dotenv').config();

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes')
const profileRoutes = require('./routes/profileRoutes')
const port = require('./config/port')
const db = require('./config/db')
const session = require('express-session');
const passport = require('passport');
const {variables} = require('./middlewares/variables')
const app = express();


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

//Setting Up Views
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'index'
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

app.use(variables);

app.use('/', authRoutes);


app.listen(port.portID, (req, res) => {
    console.log('Server is running at port ' + port.portID)
})