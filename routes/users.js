const express = require("express");
const userController = require("./../controllers/user");

const router = express.Router();

router.get("/profile", userController.profile);
router.get("/edit", userController.editUser);

module.exports = router;
