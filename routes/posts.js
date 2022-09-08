const express = require("express");
const postController = require("../controllers/posts");

const router = express.Router();

router.get("/", postController.getPosts);

module.exports = router;
