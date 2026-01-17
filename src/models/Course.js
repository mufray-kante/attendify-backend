const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  courseCode: String,
  courseName: String,
  lecturerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  semester: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Course", courseSchema);
