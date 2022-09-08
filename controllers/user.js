function profile(req, res) {
  res.end("<h1>Profile Page of the user..</h1>");
}

function editUser(req, res) {
  res.end("<h1>Edit the user..</h1>");
}

module.exports = {
  profile,
  editUser,
};
