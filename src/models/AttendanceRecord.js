const mongoose = require("mongoose");

const attendanceRecordSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "AttendanceSession" },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  markedAt: { type: Date, default: Date.now },
  method: { type: String, enum: ["QR", "OTP"] },
  deviceHash: String,
});

attendanceRecordSchema.index({ sessionId: 1, studentId: 1 }, { unique: true });

module.exports = mongoose.model("AttendanceRecord", attendanceRecordSchema);
