const express = require("express");
const userController = require("./../../../controllers/api/v2/user_api");

const router = express.Router();

router.use("/", userController.getUsers);

module.exports = router;
