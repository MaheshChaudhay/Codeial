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
    .then((posts) => {
      return res.render("home", { title: "Home", posts });
    })
    .catch((err) => {
      console.log("error in fetching posts : ", err);
      return res.send({ message: err });
    });
}

module.exports = {
  home,
};
