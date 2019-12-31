"use strict";
/** Import Dependencies */
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

/** Import Routes */
const userRoute = require('./routes/user');
const apptRoute = require('./routes/appointment');
const lookupRoute = require('./routes/lookup');

/** Config */
dotenv.config({ path: path.resolve(__dirname, `./${process.env.NODE_ENV}.env`)}); // choose  *.env file for environment specified in package.json
const PORT = 3000;

/** Connect to DB */
mongoose.connect(
	process.env.DB_CONNECT, 
	{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
	}	
).then(() => console.log("Connected to db!"))
.catch(err => console.log('Db connection failed: ' + err));

/** Middleware */
app.use(express.json()); // body parser

/** Route middleware */
app.use('/api/users', userRoute);
app.use('/api/appts', apptRoute);
app.use('/api/lookup', lookupRoute);

/** Handle 404 Errors */  
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
/** Display Errors */
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

/** Start App */
app.listen(PORT, ()=>{
	console.log('Running on port: ', PORT);
});

module.exports = app;