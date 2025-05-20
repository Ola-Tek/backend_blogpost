const express = require("express");
const router = express.Router();
const { signup, signin, forgetPassword, resetPassword, refreshAccessToken } = require('../../controllers/authcontroller');

// Sign Up
router.post("/signup", signup);

// Sign In
router.post("/signin", signin);

//fogot-password
router.post("/forgot-password", forgetPassword);

//reset password
router.post("/reset-password", resetPassword);

//refresh token
router.post("/refresh-access-token", refreshAccessToken);


module.exports = router;
