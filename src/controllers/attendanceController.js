// src/controllers/attendanceController.js
const crypto = require("crypto");
const AttendanceSession = require("../models/AttendanceSession");
const AttendanceRecord = require("../models/AttendanceRecord");

/* ---------------- CREATE SESSION ---------------- */
exports.createAttendanceSession = async (req, res) => {
  try {
    const { courseId, durationMinutes } = req.body;

    if (!courseId || !durationMinutes) {
      return res.status(400).json({ message: "courseId and durationMinutes required" });
    }

    // Generate secure random session token
    const sessionToken = crypto.randomBytes(16).toString("hex");

    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    // Create session with real lecturer ID from JWT
    const session = await AttendanceSession.create({
      courseId,
      lecturerId: req.user.id,
      sessionToken,
      expiresAt,
      isActive: true
    });

    res.status(201).json({
      message: "Attendance session started",
      sessionId: session._id,
      token: sessionToken,
      expiresAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create session" });
  }
};

/* ---------------- END SESSION ---------------- */
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: "sessionId required" });

    const session = await AttendanceSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    session.isActive = false;
    await session.save();

    res.json({ message: "Session ended" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to end session" });
  }
};

/* ---------------- MARK ATTENDANCE ---------------- */
exports.markAttendance = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "Token required" });

    // Find active session by token
    const session = await AttendanceSession.findOne({
      sessionToken: token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return res.status(400).json({ message: "Invalid or expired session" });
    }

    // Prevent duplicate attendance
    const existingRecord = await AttendanceRecord.findOne({
      sessionId: session._id,
      studentId: req.user.id
    });
    if (existingRecord) {
      return res.status(400).json({ message: "Attendance already marked" });
    }

    await AttendanceRecord.create({
      sessionId: session._id,
      studentId: req.user.id
    });

    res.json({ message: "Attendance marked successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};
