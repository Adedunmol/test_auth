require('dotenv').config();
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConnection');
const verifyJWT = require('./middlewares/verifyJWT')
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3500

//connect to database
connectDB();

// middleware to handle form data
app.use(express.urlencoded({ extended: false }));

//middleware to handle json data
app.use(express.json());

//middleware to parse cookies
app.use(cookieParser());

//registration route
app.use('/registration', require('./routes/register'))

//login route
app.use('/login', require('./routes/login'))

//logout route
app.use('/logout', require('./routes/logout'))

//refreshToken route
app.use('/refresh', require('./routes/refreshToken'))

//check for access tokens for the routes below
app.use(verifyJWT)

//movies route
app.use('/movies', require('./routes/movies'))

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`)
    });
});