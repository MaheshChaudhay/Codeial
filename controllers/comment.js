const Comment = require("./../models/comment");
const Post = require("./../models/post");

function addComment(req, res) {
  Post.findById(req.body.post)
    .then((post) => {
      if (post) {
        Comment.create({
          content: req.body.comment,
          user: req.user._id,
          post: req.body.post,
        })
          .then((comment) => {
            post.comments.push(comment._id);
            post.save();
            return res.redirect("/");
          })
          .catch((err) => {
            console.log("error in adding comment : ", err);
            return res.send({ message: err });
          });
      }
    })
    .catch((err) => {
      console.log("error in fetching he post : ", err);
      return res.send({ message: err });
    });
}

function deleteComment(req, res) {
  Comment.findById(req.params.id).then((comment) => {
    if (comment && req.user.id == comment.user) {
      const postId = comment.post;
      comment.remove();
      Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id },
      }).then(() => {
        return res.redirect("back");
      });
    } else {
      return res.redirect("back");
    }
  });
}

module.exports = {
  addComment,
  deleteComment,
};
