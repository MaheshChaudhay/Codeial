const User = require("./../models/user");

function profile(req, res) {
  return res.render("profile", { title: "Profile" });
}

function editUser(req, res) {
  res.end("<h1>Edit the user..</h1>");
}

function getSignup(req, res) {
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
  return res.render("login", { title: "Login" });
}

function login(req, res) {
  console.log(req.body);
  return res.send("<h1>Login successfull..</h1>");
}

module.exports = {
  profile,
  editUser,
  getSignup,
  createUser,
  getLogin,
  login,
};
