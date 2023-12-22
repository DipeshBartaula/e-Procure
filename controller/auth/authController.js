const User = require("../../model/userModel");

//for hashing
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/email");

// user registration
exports.registerUser = async (req, res) => {
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
};

//user login
exports.loginUser = async (req, res) => {
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
};

//forgot password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide email",
    });
  }

  //check if that email exist
  const userExist = await User.find({ userEmail: email });
  if (userExist.length == 0) {
    return res.status(404).json({
      message: "User with that email doesn't exist",
    });
  }

  //otherwise send otp to that email
  const otp = Math.floor(1000 + Math.random() * 9000);
  userExist[0].otp = otp;
  await userExist[0].save();
  await sendEmail({
    email: "dipeshbartaula4@gmail.com",
    subject: "Otp for password reset",
    message: `${otp}`, //chunk value must be of string type
  });
  res.status(200).json({
    message: "Otp sent successfully",
  });
};

//verify otp
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({
      message: "Please provide email and otp",
    });
  }

  //check if email exists
  const userExists = await User.find({ userEmail: email });
  if (userExists.length == 0) {
    return res.status(404).json({
      message: "User isn't registered",
    });
  }

  //check otp
  if (userExists[0].otp !== otp) {
    res.status(404).json({
      message: "Invalid otp",
    });
  } else {
    //dispost otp so it cannot be used next time the same otp
    userExists[0].otp = undefined;
    userExists[0].isOtpVerified = true;
    await userExists[0].save();
    res.status(200).json({
      message: "Valid otp",
    });
  }
};

//reset password
exports.resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json({
      message: "Provide email, newPassword and confirmPassword",
    });
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      message: "newPassword and confirmPassword don't match",
    });
  }

  const userExist = await User.find({ userEmail: email });
  if (userExist.length == 0) {
    return res.status(400).json({
      message: "User isn't registered",
    });
  }

  if (userExist[0].isOtpVerified !== true) {
    return res.status(400).json({
      message: "You can't perform this action",
    });
  }
  userExist[0].userPassword = bcrypt.hashSync(newPassword, 8);
  userExist[0].isOtpVerified = false;
  await userExist[0].save();
  res.status(200).json({
    message: "Password changed successfully",
  });
};
