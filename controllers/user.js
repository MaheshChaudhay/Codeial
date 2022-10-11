const User = require("./../models/user");
const fs = require("fs");
const path = require("path");
const Friendship = require("./../models/friendship");

function profile(req, res) {
  User.findById(req.params.id)
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
    .then((user) => {
      if (req.user.id == user._id) {
        return res.render("profile", { title: "Profile", profileUser: user });
      } else {
        console.log("profile user>>>>>>>", user);
        console.log("re.user.id>>>>", req.user.id);
        let areFriends = false;
        let friendStatus = "Add Friend";
        user.friendships.forEach((friendship) => {
          console.log("to user >>>", friendship.to_user.id);
          console.log("from user >>>", friendship.from_user.id);

          if (
            !areFriends &&
            (friendship.to_user.id == req.user.id ||
              friendship.from_user.id == req.user.id)
          ) {
            areFriends = true;
            friendStatus = "Remove Friend";
          }
        });
        console.log("areFriends>>>>", areFriends);
        return res.render("profile", {
          title: "Profile",
          profileUser: user,
          friendStatus,
        });
      }
    })
    .catch((err) => {
      return res.redirect("back");
    });
}

function editUser(req, res) {
  return res.send("<h1>Edit the user..</h1>");
}

function getSignup(req, res) {
  if (req.isAuthenticated())
    return res.redirect(`/users/profile/${req.user.id}`);

  return res.render("signup", { title: "Signup" });
}

function createUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirm_password;
  if (password != confirmPassword) {
    console.log(password);
    console.log(confirmPassword);
    console.log("Password and confirm password are not same..");
    return res.redirect("back");
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        User.create(req.body)
          .then((newUser) => {
            console.log(`New User created successfully : ${newUser}`);
            return res.redirect("/users/login");
          })
          .catch((err) => {
            console.log(`Error in creating the user : ${err}`);
            return res.redirect("back");
          });
      } else {
        console.log("User already exists..");
        res.redirect("back");
      }
    })
    .catch((err) => {
      console.log(`Error in finding the user : ${err}`);
      return res.redirect("back");
    });
}

function getLogin(req, res) {
  if (req.isAuthenticated())
    return res.redirect(`/users/profile/${req.user.id}`);
  return res.render("login", { title: "Login" });
}

function login(req, res) {
  console.log("login >>>>>>");
  // console.log(req.body);
  req.flash("success", "You have successfully logged in..");
  return res.redirect("/");
}

function signOut(req, res) {
  console.log("logout >>>>>>");

  req.logout(function (err) {
    if (err) {
      return res.send({ message: err });
    } else {
      req.flash("success", "You have suucessfully logged out..");
      return res.redirect("/");
    }
  });
}

async function updateUSer(req, res) {
  if (req.params.id == req.user.id) {
    try {
      const user = await User.findById(req.params.id);
      console.log(user);
      User.uploadAvatar(req, res, function (err) {
        if (err) {
          console.log("*****Multer Error", err);
        }

        user.name = req.body.name;
        user.email = req.body.email;
        if (req.file) {
          // console.log(req.file);

          if (
            user.avatar &&
            fs.existsSync(path.join(__dirname, "..", user.avatar))
          ) {
            fs.unlinkSync(path.join(__dirname, "..", user.avatar));
          }
          user.avatar = User.avatarPath + "/" + req.file.filename;
        }

        user.save();
        return res.redirect("back");
      });
    } catch (error) {
      console.log(error);
      req.flash("error", error);
      return res.redirect("back");
    }
  } else {
    req.flash("error", "You cannot delete this post!");
    return res.redirect("back");
  }
}

async function toggleFriend(req, res) {
  let deleted = false;
  console.log("req.params.id>>>>", req.params.id);
  console.log("req.user.id>>>>>>>", req.user.id);
  let existingFriendship = await Friendship.findOne({
    to_user: req.params.id,
    from_user: req.user.id,
  });
  if (!existingFriendship) {
    existingFriendship = await Friendship.findOne({
      to_user: req.user.id,
      from_user: req.params.id,
    });
  }
  if (existingFriendship) {
    const deletedFriendship = await Friendship.findByIdAndDelete(
      existingFriendship._id
    );
    await User.findByIdAndUpdate(req.params.id, {
      $pull: {
        friendships: existingFriendship._id,
      },
    });
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        friendships: existingFriendship._id,
      },
    });
    console.log("removedFriendship>>>>>>>>", existingFriendship);
    deleted = true;
    return res.status(200).json({
      message: "Friend removed successfully",
      data: {
        deleted,
      },
    });
  } else {
    const newFriendship = await Friendship.create({
      to_user: req.params.id,
      from_user: req.user.id,
    });
    const toUser = await User.findById(req.params.id);
    toUser.friendships.push(newFriendship._id);
    const fromUser = await User.findById(req.user.id);
    fromUser.friendships.push(newFriendship._id);
    toUser.save();
    fromUser.save();
    console.log("new friendship >>>", newFriendship);
    return res.status(200).json({
      message: "Friend added successfully",
      data: {
        deleted,
        friend: newFriendship,
      },
    });
  }
}

module.exports = {
  profile,
  editUser,
  getSignup,
  createUser,
  getLogin,
  login,
  signOut,
  updateUSer,
  toggleFriend,
};
