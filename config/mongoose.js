const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/codeial_db");

const db = mongoose.connection;

db.on("error", console.error.bind(console, `Error in connecting to database`));
db.once("open", function () {
  console.log("Connection to database is successful..");
});

module.exports = db;
