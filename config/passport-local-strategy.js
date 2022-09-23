const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./../models/user");

passport.use(
  new LocalStrategy(
    { usernameField: "email", passReqToCallback: true },
    function (req, email, password, cb) {
      console.log("passport authentication >>>>>>");
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          console.log("Error in finding the user --> passport");
          req.flash("error", err);
          return cb(err);
        } else if (!user || user.password != password) {
          console.log("Invalid username or password");
          req.flash("error", "Invalid username or password");
          return cb(null, false);
        } else if (user) {
          return cb(null, user);
        }
      });
    }
  )
);

passport.serializeUser(function (user, cb) {
  return cb(null, user._id);
});

passport.deserializeUser(function (id, cb) {
  User.findById(id)
    .then((user) => {
      if (user) {
        return cb(null, user);
      } else {
        console.log("error in fidning the user by id >>>>>>");
        return cb(err);
      }
    })
    .catch((err) => {
      console.log("Error in fidning the user..");
      return cb(err);
    });
});

passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/users/login");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};

module.exports = passport;
