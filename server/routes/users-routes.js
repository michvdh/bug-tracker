const express = require("express");
const router = express.Router();
const usersController = require("../controller/users-controller");

router.get("/", (req, res, next) => {
  console.log("Get request in places");
  res.json({ message: "It works!" });
});

router.post("/signup", usersController.signup);

router.post("/login", usersController.login);

module.exports = router;
