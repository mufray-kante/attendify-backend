const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");

// Public route
router.get("/public", (req, res) => {
    res.json({ message: "This is a public route" });
});

// Protected route
router.get("/protected", protect, (req, res) => {
    res.json({ message: `Hello ${req.user.name || "user"}, you accessed a protected route` });
});

// Admin-only route
router.get("/admin", protect, requireRole("admin"), (req, res) => {
    res.json({ message: "Welcome admin" });
});

module.exports = router;
