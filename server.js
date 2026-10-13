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

app.use(passport.initialize());

app.use("/menu", menuRouter);
app.use("/person", personRouter);

app.listen(Port, console.log("Server Started Succesfully on Port:" + Port));
