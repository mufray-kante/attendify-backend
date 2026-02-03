const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/authController");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { loginLimiter } = require("../middlewares/securityLayer");

// ---------------- PUBLIC ROUTES ----------------

// User registration
router.post("/register", registerUser);

// User login (rate-limited)
router.post("/login", loginLimiter, loginUser);

// Health / public test route
router.get("/public", (req, res) => {
    res.json({ message: "Auth service is public and working" });
});

// ---------------- PROTECTED ROUTES ----------------

// Any authenticated user
router.get("/protected", protect, (req, res) => {
    res.json({
        message: `Hello ${req.user?.fullName || "user"}, protected route accessed`,
    });
});

// Admin-only route
router.get("/admin", protect, requireRole("admin"), (req, res) => {
    res.json({ message: "Welcome admin" });
});

module.exports = router;
