const Comment = require("./../models/comment");
const Post = require("./../models/post");
const commentsMailer = require("./../mailers/comment_mailer");
const commentEmailWorker = require("./../workers/comment_email_worker");
const queue = require("./../config/kue");
const Like = require("./../models/like");

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
            comment.populate("user").then((comment) => {
              // commentsMailer.newComment(comment);
              let job = queue.create("emails", comment).save(function (err) {
                if (err) {
                  console.log("error in creating a queue");
                }
                console.log("job enqueued : ", job.id);
              });
              commentEmailWorker;
              if (req.xhr) {
                return res.status(200).json({
                  data: {
                    comment: comment,
                  },
                  message: "Comment added!",
                });
              }

              return res.redirect("/");
            });
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
      Like.deleteMany({ _id: comment.likes }).then((likes) => {
        console.log("Deleted likes >>>>>", likes);
        comment.remove();
        Post.findByIdAndUpdate(postId, {
          $pull: { comments: req.params.id },
        }).then(() => {
          if (req.xhr) {
            return res.status(200).json({
              data: {
                comment_id: req.params.id,
              },
              message: "Comment Deleted!",
            });
          }
          return res.redirect("back");
        });
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
