const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose')
const port = require('./config/port')
const db = require('./config/db')
const session = require('express-session');
const app = express();

//Setting Up Express
app.use(express())
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

//Setting Up Mongoose
mongoose.connect(db.dbURL , {useNewUrlParser: true, useUnifiedTopology: true})
    .then(response => {
        console.log('MongoDB connected succesfully')
    })
    .catch(err => {
        console.log('MongoDB connection failed')
    })

//Setting Up Views
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port.portID, (req, res)=>{
    console.log('Server is running at port ' + port.portID)
})