const express = require("express");
const passport = require("passport");
const userController = require("./../controllers/user");

const router = express.Router();

router.get(
  "/profile/:id",
  passport.checkAuthentication,
  userController.profile
);
router.get("/edit", userController.editUser);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.createUser);
router.get("/login", userController.getLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/users/login",
  }),
  userController.login
);

router.get("/signout", userController.signOut);
router.post("/update/:id", userController.updateUSer);

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/users/login",
  }),
  userController.login
);

router.get("/toggle-friend/:id", userController.toggleFriend);

module.exports = router;
