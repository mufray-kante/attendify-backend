const express = require("express");
const router = express.Router();
const {
    createAttendanceSession,
    endSession,
    generateSessionQR,
    markAttendance
} = require("../controllers/attendanceController");

const { protect, requireRole } = require("../middlewares/authMiddleware");

// Lecturer routes
router.post("/", protect, requireRole("lecturer"), createAttendanceSession);
router.patch("/end", protect, requireRole("lecturer"), endSession);
router.get("/:sessionId/qr", protect, requireRole("lecturer"), generateSessionQR);

// Student route
router.post("/mark", protect, requireRole("student"), markAttendance);

module.exports = router;
