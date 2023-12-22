const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOtp,
} = require("../controller/auth/authController");

const router = require("express").Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgotPassword").post(forgotPassword);
router.route("/verifyOtp").post(verifyOtp);

module.exports = router;
