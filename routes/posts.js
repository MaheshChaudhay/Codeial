const express = require("express");
const postController = require("../controllers/posts");
const passport = require("passport");

const router = express.Router();

router.get("/", postController.getPosts);

router.post("/", passport.checkAuthentication, postController.createPost);

module.exports = router;
