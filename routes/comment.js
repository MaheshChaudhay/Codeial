const express = require("express");
const commentcontroller = require("./../controllers/comment");
const passport = require("passport");
const router = express.Router();

router.post(
  "/create-comment",
  passport.checkAuthentication,
  commentcontroller.addComment
);

router.get(
  "/destroy/:id",
  passport.checkAuthentication,
  commentcontroller.deleteComment
);

module.exports = router;
