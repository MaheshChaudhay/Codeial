function getUsers(req, res) {
  return res.status(200).json({
    message: "Response from users api v2",
    users: ["Mahesh", "Ram", "Anita"],
  });
}

module.exports = {
  getUsers,
};
