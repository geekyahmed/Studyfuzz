const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const config = require('./config/port')
const session = require('express-session');
const app = express();

//Setting Up Express
app.use(express())
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

//Setting Up Views
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.app.port, (req, res)=>{
    console.log('Server is running at port' + config.app.port)
})