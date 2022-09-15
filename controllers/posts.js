const mongoose = require("mongoose");
const Post = require("./../models/post");

function getPosts(req, res) {
  res.end("<h1>All posts of this user..</h1>");
}

function createPost(req, res) {
  const user = req.user._id;
  console.log(user);
  Post.create({
    content: req.body.content,
    user: user,
  })
    .then((post) => {
      console.log(`Post cdreated successfully.. ${post}`);
      return res.redirect("/");
    })
    .catch((err) => {
      console.log(`Error in creating the post : ${err}`);
      return res.send({ message: err });
    });
}

module.exports = {
  getPosts,
  createPost,
};
