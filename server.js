require('dotenv').config();
const express = require("express");
const app = express();
const Port = process.env.PORT || 5000;
const parser = require('body-parser')
const personRouter = require('./routes/personRoute');
const menuRouter = require('./routes/menuRoute');

//DataBase Connection
const connectDB = require('./db');
connectDB();

// Parsing Data
app.use(parser.json());

/* CRUD Operations  
    Post - Create
    Get - Read
    Put - Update
    Delete - Delete
*/

app.use("/menu",menuRouter)
app.use("/person", personRouter);


app.listen(Port, console.log("Server Started Succesfully on Port:" + Port));
