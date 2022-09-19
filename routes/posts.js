const express = require("express");
const postController = require("../controllers/posts");
const passport = require("passport");

const router = express.Router();

router.get("/", postController.getPosts);

router.post("/", passport.checkAuthentication, postController.createPost);
router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  postController.deletePost
);

module.exports = router;
