const User = require("./../models/user");
const fs = require("fs");
const path = require("path");

function profile(req, res) {
  User.findById(req.params.id)
    .then((user) => {
      return res.render("profile", { title: "Profile", profileUser: user });
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

module.exports = {
  profile,
  editUser,
  getSignup,
  createUser,
  getLogin,
  login,
  signOut,
  updateUSer,
};
