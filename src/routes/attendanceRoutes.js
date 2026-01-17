const express = require("express");
const router = express.Router();

const {
    createAttendanceSession,
    markAttendance
} = require("../controllers/attendanceController");

const { protect, allowRoles } = require("../middlewares/security");

/* ================= LECTURER ================= */
// Only lecturers can start attendance
router.post(
    "/start",
    protect,
    allowRoles("lecturer"),
    createAttendanceSession
);

/* ================= STUDENT ================= */
// Only students can mark attendance
router.post(
    "/mark",
    protect,
    allowRoles("student"),
    markAttendance
);

module.exports = router;

