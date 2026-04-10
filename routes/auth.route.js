const express = require("express");

const {
    registerUser,
    loginUser,
} = require("../controllers/auth.controller.js");

const router = express.Router();

// all router are related to auth & authorization

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
