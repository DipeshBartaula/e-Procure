const User = require("./model/userModel");
const bcrypt = require("bcryptjs");

const adminSeeder = async () => {
  //checking if admin exists or not
  const foundAdmin = await User.findOne({ userEmail: "admin@gmail.com" });
  if (!foundAdmin) {
    await User.create({
      userEmail: "admin@gmail.com",
      userPassword: bcrypt.hashSync("admin", 8),
      userPhoneNumber: 9845684545,
      userName: "admin",
      role: "admin",
    });
    console.log("Admin seeded");
  } else {
    console.log("Admin already seeded");
  }
};

module.exports = adminSeeder;
