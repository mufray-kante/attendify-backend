const express = require("express");
const router = express.Router();

// Correct controller import (match exact casing)
const { registerUser, loginUser } = require("../controllers/authController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

// ---------------- PUBLIC ROUTES ----------------

// User registration
router.post("/register", registerUser);

// User login
router.post("/login", loginUser);

// Example public GET route
router.get("/public", (req, res) => {
    res.json({ message: "This is a public route" });
});

// ---------------- PROTECTED ROUTES ----------------

// Any authenticated user
router.get("/protected", protect, (req, res) => {
    res.json({
        message: `Hello ${req.user.fullName || "user"}, you accessed a protected route`,
    });
});

// Admin-only route
router.get("/admin", protect, requireRole("admin"), (req, res) => {
    res.json({ message: "Welcome admin" });
});

module.exports = router;
