const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const path = require("path");
const db = require("./config/mongoose");
const MongoStore = require("connect-mongo");
const sassMiddleware = require("node-sass-middleware");
const flash = require("connect-flash");
const customMidlleware = require("./config/middleware");

const port = 8000;

const app = express();

app.use(
  sassMiddleware({
    src: "./public/scss",
    dest: "./public/styles",
    debug: true,
    outputStyle: "extended",
    prefix: "/styles",
  })
);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.use(express.static("public"));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));

app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

app.use(
  session({
    name: "Codeial",
    secret: "Jai Shri Ram",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: new MongoStore(
      {
        mongoUrl: "mongodb://localhost:27017/codeial_db",
        collectionName: "sessions",
        autoRemove: "disabled",
      },
      function (err) {
        console.log(err || "connect mongodb-setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMidlleware.setFlash);

app.use("/", require("./routes/index"));

app.listen(port, (err) => {
  if (err) {
    console.log(`Error in running the server : ${err}`);
    return;
  }
  console.log(`Server is running on port : ${port}`);
});
