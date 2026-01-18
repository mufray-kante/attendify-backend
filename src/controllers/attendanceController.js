const crypto = require("crypto");
const QRCode = require("qrcode");
const AttendanceSession = require("../models/AttendanceSession");
const AttendanceRecord = require("../models/AttendanceRecord");
const Enrollment = require("../models/Enrollment");

/* ---------------- CREATE SESSION (LECTURER) ---------------- */
exports.createAttendanceSession = async (req, res) => {
  try {
    const { courseId, durationMinutes } = req.body;

    if (!courseId || !durationMinutes) {
      return res.status(400).json({ message: "courseId and durationMinutes are required" });
    }

    // Generate 6-digit PIN
    const sessionToken = crypto.randomInt(100000, 999999).toString();

    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

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
      pin: sessionToken,
      expiresAt
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create session" });
  }
};

/* ---------------- END SESSION (LECTURER ONLY) ---------------- */
exports.endSession = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) return res.status(400).json({ message: "sessionId required" });

    const session = await AttendanceSession.findOne({
      _id: sessionId,
      lecturerId: req.user.id
    });

    if (!session) return res.status(404).json({ message: "Session not found or unauthorized" });

    session.isActive = false;
    await session.save();

    res.json({ message: "Session ended successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to end session" });
  }
};

/* ---------------- GENERATE QR CODE (LECTURER ONLY) ---------------- */
exports.generateSessionQR = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await AttendanceSession.findOne({
      _id: sessionId,
      lecturerId: req.user.id
    });

    if (!session) return res.status(404).json({ message: "Session not found or unauthorized" });

    const qrCodeUrl = await QRCode.toDataURL(session.sessionToken);

    res.json({
      status: "success",
      sessionId: session._id,
      qrCodeUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to generate QR code" });
  }
};

/* ---------------- MARK ATTENDANCE (STUDENT) ---------------- */
exports.markAttendance = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ message: "PIN required" });

    const session = await AttendanceSession.findOne({
      sessionToken: token,
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!session) return res.status(400).json({ message: "Invalid or expired session" });

    // Check enrollment
    const enrolled = await Enrollment.findOne({
      studentId: req.user.id,
      courseId: session.courseId
    });

    if (!enrolled) return res.status(403).json({ message: "You are not enrolled in this course" });

    // Prevent duplicates
    const alreadyMarked = await AttendanceRecord.findOne({
      sessionId: session._id,
      studentId: req.user.id
    });

    if (alreadyMarked) return res.status(400).json({ message: "Attendance already marked" });

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
