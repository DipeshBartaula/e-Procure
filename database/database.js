const mongoose = require("mongoose");

//connecting to database
exports.connectDatabase = async (URI) => {
  await mongoose.connect(URI);
  console.log("Database connected successfully");
};
