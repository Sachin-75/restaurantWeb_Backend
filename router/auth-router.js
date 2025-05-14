const express = require("express");
const router = express.Router();
const { login, register, forgetpass, resetPass } = require("../controllers/auth-controller"); // Destructuring to get individual functions

router.route("/login").post(login);

router.route("/register").post(register);

router.route("/forgetpass").post(forgetpass);

router.route("/resetPass/:token").post(resetPass);

module.exports = router;
