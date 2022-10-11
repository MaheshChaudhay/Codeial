const express = require("express");
const likesController = require("./../controllers/like");
const passport = require("passport");

const router = express.Router();

router.get("/toggle", passport.checkAuthentication, likesController.toggleLike);

module.exports = router;
