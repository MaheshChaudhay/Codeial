const passport = require("passport");
const googleStrategy = require("passport-google-oauth").OAuth2Strategy;
const crypto = require("crypto");
const User = require("./../models/user");

passport.use(
  new googleStrategy(
    {
      clientID:
        "664209199298-3qqgiqda855gr27ts5qbjlvhotel5eaj.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:8000/users/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("access token >>>", accessToken);
      console.log("refresh token >>>", refreshToken);

      User.findOne({ email: profile.emails[0].value }).exec((err, user) => {
        if (err) {
          console.log("error in google-passport-strategy", err);
          return;
        }
        if (user) {
          return done(null, user);
        } else {
          User.create(
            {
              name: profile.displayName,
              email: profile.emails[0].value,
              password: crypto.randomBytes(20).toString("hex"),
            },
            function (err, user) {
              if (err) {
                console.log(
                  "error in creating user google-passport-strategy",
                  err
                );
                return;
              }
              return done(null, user);
            }
          );
        }
      });
    }
  )
);

module.exports = passport;
