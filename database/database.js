const mongoose = require("mongoose");

//connecting to database
exports.connectDatabase = async () => {
  await mongoose.connect(
    "mongodb+srv://e-Procure:e-Procure@cluster0.fczqyfy.mongodb.net/?retryWrites=true&w=majority"
  );
  console.log("Database connected successfully");
};
