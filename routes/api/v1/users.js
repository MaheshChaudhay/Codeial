const express = require("express");
const userController = require("./../../../controllers/api/v1/user_api");

const router = express.Router();

router.post("/signin", userController.signIn);

module.exports = router;
