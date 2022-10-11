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
      User.find({})
        .populate({
          path: "friendships",
          populate: {
            path: "from_user",
          },
        })
        .populate({
          path: "friendships",
          populate: {
            path: "to_user",
          },
        })
        .then((users) => {
          if (req.user) {
            console.log("USer is logged in : ", req.user);
            const loggedInUser = User.findById(req.user.id)
              .populate({
                path: "friendships",
                populate: {
                  path: "to_user",
                },
              })
              .populate({
                path: "friendships",
                populate: {
                  path: "from_user",
                },
              })
              .then((user) => {
                const friends = [];
                user.friendships.forEach((friendship) => {
                  if (req.user.id == friendship.to_user._id) {
                    friends.push(friendship.from_user);
                  } else {
                    friends.push(friendship.to_user);
                  }
                });
                console.log("user friends>>>>", friends);
                return res.render("home", {
                  title: "Codeial | Home",
                  posts,
                  users,
                  friends,
                });
              });
          } else {
            return res.render("home", {
              title: "Codeial | Home",
              posts,
              users,
            });
          }
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
