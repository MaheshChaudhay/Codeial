function profile(req, res) {
  return res.render("profile", { title: "Profile" });
}

function editUser(req, res) {
  res.end("<h1>Edit the user..</h1>");
}

module.exports = {
  profile,
  editUser,
};
