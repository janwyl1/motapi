"use strict";

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// const expressValidator = require('express-validator');

// Import Routes
const userRoute = require('./routes/user');
const apptRoute = require('./routes/appointment');

// config
dotenv.config();
const PORT = 3000;

// Connect to DB
mongoose.connect(
	process.env.DB_CONNECT, 
	{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
	},
	() => {
		console.log("Connected to db!");
	}
);


// Middleware
app.use(express.json()); // body parser
// app.use(expressValidator()); // express validator

// Route middlewares
app.use('/api/users', userRoute);
app.use('/api/appt', apptRoute);

app.use((err, req, res, next) => {
	// res.status(500).send(err);
  res.status(500).send({error: err.message});
});

app.listen(PORT, ()=>{
	console.log('Running on port: ',PORT);
});

module.exports = app;