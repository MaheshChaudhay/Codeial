const User = require("./../../../models/user");
const jwt = require("jsonwebtoken");

async function signIn(req, res) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user || user.password != req.body.password) {
      return res.status(422).json({
        message: "Invalid Email or Paswword",
      });
    }
    return res.status(200).json({
      message: "You have successfylly signed in and here's your JWT token",
      data: {
        token: jwt.sign(user.toJSON(), "Codeial", {
          expiresIn: 100000,
        }),
      },
    });
  } catch (error) {
    console.log("Error in fetching the user : ", error);
    return res.json(500, {
      message: "Internal Server Error",
    });
  }
}

module.exports = {
  signIn,
};
