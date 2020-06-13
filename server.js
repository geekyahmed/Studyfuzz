require("dotenv").config();

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const feedRoutes = require("./routes/feedRoutes");
const profileRoutes = require("./routes/profileRoutes");
const port = require("./config/port");
const responseTime = require("response-time");
const morgan = require("morgan");
const db = require("./config/db");
const fileUpload = require("express-fileupload");
const session = require("express-session");
const passport = require("passport");
const { variables } = require("./middlewares/variables");

const app = express();

//Setting Up Express
app.use(express());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());

//Setting Up Session
app.use(
  session({
    resave: true,
    secret: process.env.SESSION_KEY,
    saveUninitialized: true,
  })
);

//File Upload Middleware
app.use(fileUpload());

//Configure Environments
switch (app.get("env")) {
  case "development":
    mongoose
      .connect(db.development.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then((response) => {
        console.log("MongoDB Development connected succesfully");
      })
      .catch((err) => {
        console.log("MongoDB connection failed");
      });

    app.use(morgan("dev"));
    break;
  case "production":
    mongoose
      .connect(db.production.connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      })
      .then((response) => {
        console.log("MongoDB Production connected succesfully");
      })
      .catch((err) => {
        console.log("MongoDB connection failed");
      });

    app.use(morgan("tiny"));
    break;
  default:
    throw new Error("Unknown environment");
}

//Setting up Passport
app.use(passport.initialize());
app.use(passport.session());

//X-Response-Time Middleware
app.use(responseTime());

//Default Variables
app.use(variables);

//API ROUTES
app.use("/api", authRoutes, feedRoutes, profileRoutes);

//LIsten To Server and Port Number
app.listen(port.portID, (req, res) => {
  console.log("Server is running at port " + port.portID);
});
