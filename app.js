const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");
const User = require("./model/userModel.js");

//for hashing
const bcrypt = require("bcryptjs");

//Node will use DOTENV
require("dotenv").config();

//telling to parse data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Connecting to database
connectDatabase(process.env.MONGO_URI);

// testing api
app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Nice going",
  });
});

//registering user
app.post("/register", async (req, res) => {
  const { email, name, phoneNumber, password } = req.body;
  if (!email || !name || !phoneNumber || !password) {
    return res.status(401).json({
      message: "Provide email,name,phoneNumber,password",
    });
  }
  await User.create({
    userEmail: email,
    userName: name,
    userPhoneNumber: phoneNumber,
    userPassword: bcrypt.hashSync(password, 8),
  });
  return res.status(200).json({
    message: "User registered successfully",
  });
});

const port = process.env.PORT;
//Listen server
app.listen(port, () => {
  console.log("Server has started at port 3000");
});
