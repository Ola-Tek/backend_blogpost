require('dotenv').config();

const express = require('express');
const app = express();

//creating the port for a local route- This is needed to test our codes in a local route or port
const PORT = process.env.PORT || 5000

//initializing the express layout so we can be able to use it for our layouts
const expressLayout = require('express-ejs-layouts');

//calling the connectDB so it points to the path where it is located so it can be executed
const connectDB = require('./server/config/db');

//Creating a templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Run the connectDB
connectDB();

//assigning the express.static feature to a public folder where other static files will be created
app.use(express.static('public')); //it makes it easier for ejs to access your static files

//Setting up a basic route to test what we doing
app.use('/', require('./server/routes/main'));
app.use('/auth', require('./server/routes/auth')); //The route for authentication for signing in and signing up

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
});