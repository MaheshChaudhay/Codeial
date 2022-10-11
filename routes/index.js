const express = require("express");
const homeController = require("./../controllers/home");

const router = express.Router();

console.log("Routes loaded..");

router.get("/", homeController.home);
router.use("/users", require("./users"));
router.use("/posts", require("./posts"));
router.use("/comments", require("./comment"));
router.use("/likes", require("./likes"));

router.use("/api", require("./api"));

module.exports = router;
