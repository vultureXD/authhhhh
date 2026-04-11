const express = require("express");

const {
    registerUser,
    loginUser,
    changePassword,
} = require("../controllers/auth.controller.js");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware.js");

// all router are related to auth & authorization

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
