const restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    if (!roles.includes(userRole)) {
      return res.status(403).json({
        message: "You're forbidden to create product",
      });
    } else {
      next();
    }
  };
};

module.exports = restrictTo;
