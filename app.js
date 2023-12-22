const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");
const authRoute = require("./routes/authRoute.js");

//Node will use DOTENV
require("dotenv").config();

//telling to parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connecting to database
connectDatabase(process.env.MONGO_URI);

//Authentication route here
app.use("", authRoute);

const port = process.env.PORT;
//Listen server
app.listen(port, () => {
  console.log("Server has started at port 3000");
});
