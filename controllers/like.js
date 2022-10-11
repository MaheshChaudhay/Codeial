const Like = require("./../models/like");
const Comment = require("./../models/comment");
const Post = require("./../models/post");

async function toggleLike(req, res) {
  console.log("id >>>>>>>>>>", req.query.id);
  console.log("user >>>>>>>", req.user._id);
  console.log("type>>>>>>>>>", req.query.type);
  try {
    let likeable;
    let deleted = false;
    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    let existingLike = await Like.findOne({
      likeable: likeable,
      onModel: req.query.type,
      user: req.user._id,
    });

    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();
      existingLike.remove();
      deleted = true;
    } else {
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type,
      });
      likeable.likes.push(newLike._id);
      likeable.save();
    }

    return res.json(200, {
      message: "Request successful..",
      data: {
        deleted,
      },
    });
  } catch (error) {
    console.log("Error in liking/disliking the post or comment", error);
    return res.json(500, {
      message: "Internal Server error",
    });
  }
}

module.exports = {
  toggleLike,
};
