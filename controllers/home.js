const User = require("../models/user");
const Post = require("./../models/post");

function home(req, res) {
  // userId = req.user._id;
  Post.find({})
    .populate("user")
    .populate({
      path: "comments",
      populate: {
        path: "user",
      },
    })
    .sort("-createdAt")
    .then((posts) => {
      User.find({}).then((users) => {
        return res.render("home", { title: "Codeial | Home", posts, users });
      });
    })
    .catch((err) => {
      console.log("error in fetching posts : ", err);
      return res.send({ message: err });
    });
}

module.exports = {
  home,
};
