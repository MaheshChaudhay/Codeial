function home(req, res) {
  return res.render("home", { title: "Home" });
}

module.exports = {
  home,
};
