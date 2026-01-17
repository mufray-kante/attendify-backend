const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { loginLimiter } = require("../middlewares/securityLayer");

router.post("/register", registerUser);

// Brute-force protected login
router.post("/login", loginLimiter, loginUser);

module.exports = router;


