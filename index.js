const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require('passport');
const session = require('express-session');
require('./passport')
require('dotenv').config();

//define env config
port = process.env.PORT || 3000;
mongodb = process.env.MONGODB_STRING;
secret = process.env.clientSecret;





//setup middleware
const corsOptions = {
    origin: ['http://localhost:8000'], 
    credentials: true, 
    optionsSuccessStatus: 200 
};


//connect to MONGODB
mongoose.connect(mongodb);
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));


//setup the server

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors(corsOptions));
app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// define and set up routes
const cartRoutes = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoute");
const productRoutes = require("./routes/productRoute");
const userRoutes = require("./routes/userRoute");


app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/products", productRoutes);
app.use("/users", userRoutes);


//initialize the server
if(require.main === module){
	app.listen(port, () => {
		console.log(`API is now online on port ${ port || 3000}`)
	});
}

module.exports = {app, mongoose};