const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");
//connecting to database
exports.connectDatabase = async (URI) => {
  await mongoose.connect(URI);
  console.log("Database connected successfully");

  //admin seeding function
  adminSeeder();
};
