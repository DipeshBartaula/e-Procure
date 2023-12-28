const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");

//Routes here
const authRoute = require("./routes/authRoute.js");
const productRoute = require("./routes/productRoute.js");

//Node will use DOTENV
require("dotenv").config();

//telling to parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connecting to database
connectDatabase(process.env.MONGO_URI);

//
app.use("/api", authRoute);
app.use("/api", productRoute);

const port = process.env.PORT;
//Listen server
app.listen(port, () => {
  console.log("Server has started at port 3000");
});
