const Post = require("./../models/post");
const Comment = require("./../models/comment");
const Like = require("./../models/like");

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
      post.populate("user").then((post) => {
        if (req.xhr) {
          return res.status(200).json({
            data: {
              post: post,
            },
            message: "Post created!",
          });
        }
        req.flash("success", "Post Published!");
        return res.redirect("back");
      });
    })
    .catch((err) => {
      req.flash("error", err);
      return res.redirect("back");
    });
}

function deletePost(req, res) {
  console.log(req.params.id);
  Post.findById(req.params.id)
    .then((post) => {
      if (post && post.user == req.user.id) {
        // console.log("post>>>", post);
        Like.deleteMany({ _id: post.likes }).then((likes) => {
          console.log("deleted likes : ", likes);
          Like.deleteMany({
            likeable: { $in: post.comments },
            onModel: "Comment",
          }).then((deletedLikes) => {
            console.log("deleted Likes >>>>>>", deletedLikes);
            post.remove();
            Comment.deleteMany({ post: req.params.id }).then((comments) => {
              if (req.xhr) {
                return res.status(200).json({
                  data: {
                    post_id: req.params.id,
                  },
                  message: "Post deleted!",
                });
              }
              req.flash(
                "success",
                "Post and associated comments deleted successfully!"
              );
              return res.redirect("back");
            });
          });
        });
      } else {
        req.flash("error", "You cannot delete this post!");
        return res.redirect("back");
      }
    })
    .catch((err) => {
      req.flash("error", err);
      return res.redirect("back");
    });
}

module.exports = {
  getPosts,
  createPost,
  deletePost,
};
