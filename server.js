require("dotenv").config();
const express = require("express");
const app = express();
const Port = process.env.PORT || 5000;
const personRouter = require("./routes/personRoute");
const menuRouter = require("./routes/menuRoute");

const passport = require("./authentication/auth");

//DataBase Connection
const connectDB = require("./db");
connectDB();

// Parsing Data
const parser = require("body-parser");
app.use(parser.json());

// Middleware for logging requests
const logger = require("./middleware/logger");
app.use(logger); // Use the logger middleware for all routes

/* CRUD Operations  
Post - Create
Get - Read
Put - Update
Delete - Delete
*/

//what is app.use(passport.initialize()) ?
// `app.use(passport.initialize())` is a middleware function that initializes Passport.js in your Express application. It sets up the necessary configurations for Passport to work, allowing you to use authentication strategies (like local, JWT, OAuth, etc.) in your routes. This line is essential for enabling authentication features provided by Passport.js. It applies the Passport middleware to all incoming requests, so that you can use Passport's authentication methods in your route handlers.
app.use(passport.initialize());

app.use("/menu", menuRouter);
app.use("/person", personRouter);

app.listen(Port, console.log("Server Started Succesfully on Port:" + Port));

//For Pushing in Git Step1-> git add . Step2-> git commit -m "message" Step3-> git push origin main
