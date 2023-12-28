const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const promisify = require("util").promisify;

const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    res.status(403).json({
      message: "Please login",
    });
  }
  //verify if token is legit or not
  //   jwt.verify(token, process.env.SECRET_KEY, (err, success) => {
  //     if (err) {
  //       res.status(403).json({
  //         message: "Invalid Token",
  //       });
  //     } else {
  //       res.status(200).json({
  //         message: "Valid token",
  //       });
  //     }
  //   });

  //Alternative of above callback
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    if (!decoded) {
      res.status(403).json({
        message: "Don't try this",
      });
    }

    //check if decoded.id(userId) exists in user table
    const doesUserExist = await User.findOne({ _id: decoded.id });
    if (!doesUserExist) {
      return res.status(404).json({
        message: "User with that token id does not exist",
      });
    }
    req.user = doesUserExist;
    next();
  } catch (error) {
    return res.status(400).json({
      message: error.messsage,
    });
  }
};

module.exports = isAuthenticated;
