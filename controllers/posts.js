const Post = require("./../models/post");
const Comment = require("./../models/comment");

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

function deletePost(req, res) {
  const post = Post.findById(req.params.id).then((post) => {
    if (post && post.user == req.user.id) {
      post.remove();

      Comment.deleteMany({ post: req.params.id }).then((comments) => {
        console.log(`Deleted comments : ${comments}`);
        return res.redirect("back");
      });
    } else {
      return res.redirect("back");
    }
  });
}

module.exports = {
  getPosts,
  createPost,
  deletePost,
};
