const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");
const User = require("./model/userModel.js");

//for hashing
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

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

  //check if that user already exists
  const userFound = await User.find({ userEmail: email });
  if (userFound.length > 0) {
    return res.status(400).json({
      message: "User already registered",
    });
  }

  //Registering user data
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

//Login user api
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide email and password",
    });
  }

  //check if user email exist
  const userFound = await User.find({ userEmail: email });
  if (userFound == 0) {
    return res.status(404).json({
      message: "User with that email is not registered",
    });
  }

  //check password
  const isMatched = bcrypt.compareSync(password, userFound[0].userPassword);
  if (isMatched) {
    // generate token
    const token = jwt.sign({ id: userFound[0]._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    res.status(200).json({
      message: "User login successfully",
      token,
    });
  } else {
    res.status(404).json({
      message: "Password doesn't match",
    });
  }
});

const port = process.env.PORT;
//Listen server
app.listen(port, () => {
  console.log("Server has started at port 3000");
});
