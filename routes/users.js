const express = require("express");
const passport = require("passport");
const userController = require("./../controllers/user");

const router = express.Router();

router.get("/profile", passport.checkAuthentication, userController.profile);
router.get("/edit", userController.editUser);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.createUser);
router.get("/login", userController.getLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
    successRedirect: "/users/profile",
  }),
  userController.login
);

router.get("/signout", userController.signOut);

module.exports = router;
