const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const userRoutes = require("./routes/user")
const courseRoutes = require("./routes/course")

require('dotenv').config();

const app = express();

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));


const corsOptions = {
  //You can also customize the CORS options to meet your specific requirements.
  //to update the origin of the request
  origin: ['http://localhost:8000'], // Allow requests from this origin (The client's URL) the origin is in array form if there are multiple origins.
  //methods: ['GET', 'POST'], // Allow only specified HTTP methods // optional only if you want to restrict the methods
//allowedHeaders: ['Content-Type', 'Authorization'], // Allow only specified headers // optional only if you want to restrict the headers
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  optionsSuccessStatus: 200 // Provides a status code to use for successful OPTIONS requests, since some legacy browsers (IE11, various SmartTVs) choke on 204.
};

app.use(cors(corsOptions));
app.use("/users", userRoutes);
app.use("/courses", courseRoutes);


if(require.main === module){
  app.listen(process.env.PORT || 3000, () => {
    console.log(`API is now online on port ${ process.env.PORT || 3000}`)
  })
}

module.exports = {app, mongoose};