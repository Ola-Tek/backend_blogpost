const express = require("express");
const router = express.Router();
const { signup, signin, forgotPassword } = require('../../controllers/authcontroller');

// Sign Up
router.post("/signup", authcontroller.signup);

// Sign In
router.post("/signin", authcontroller.signin);


module.exports = router;
