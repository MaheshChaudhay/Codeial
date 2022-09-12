const mongoose = require("mongoose");

(async function connectToDatabase() {
  try {
    await mongoose.connect("mongodb://localhost:27017/codeial_db");
    console.log("Connection to database is successful..");
  } catch (err) {
    console.log(`Error in connecting to database : ${err}`);
  }
})();
