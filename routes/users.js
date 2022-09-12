const express = require("express");
const userController = require("./../controllers/user");

const router = express.Router();

router.get("/profile", userController.profile);
router.get("/edit", userController.editUser);
router.get("/signup", userController.getSignup);
router.post("/signup", userController.createUser);
router.get("/login", userController.getLogin);
router.post("/login", userController.login);

module.exports = router;
