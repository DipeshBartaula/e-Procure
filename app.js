const express = require("express");
const app = express();
const { connectDatabase } = require("./database/database");

//Connecting to database
connectDatabase();

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Nice going",
  });
});

//Listen server
app.listen(3000, () => {
  console.log("Server has started at port 3000");
});
