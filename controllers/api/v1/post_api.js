const Post = require("./../../../models/post");
const User = require("./../../../models/user");
const Comment = require("./../../../models/comment");

async function getPosts(req, res) {
  try {
    let posts = await Post.find({})
      .populate("user")
      .populate({
        path: "comments",
        populate: {
          path: "user",
        },
      })
      .sort("-createdAt");
    return res.status(200).json({
      posts: posts,
    });
  } catch (err) {
    console.log("error in fetching posts : ", err);
    return res.status(500).json({ message: err });
  }
}

async function deletePost(req, res) {
  try {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    if (post && post.user == req.user.id) {
      post.remove();
      let comments = await Comment.deleteMany({ post: req.params.id });
      return res.status(200).json({
        message: "Post deleted successfully!",
        post: post,
      });
    } else {
      res.status(401).json({
        message: "You are not authorized to delete this post",
      });
    }
  } catch (error) {
    console.log("Error in fetching the post : ", error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  getPosts,
  deletePost,
};
