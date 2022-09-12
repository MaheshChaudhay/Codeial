const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const path = require("path");
const db = require("./config/mongoose");

const port = 8000;

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(express.static("public"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);
app.use("/", require("./routes/index"));

app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server : ${err}`);
    return;
  }
  console.log(`Server is running on port : ${port}`);
});
