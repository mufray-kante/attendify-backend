const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  universityId: { type: mongoose.Schema.Types.ObjectId, ref: "University" },
  role: { type: String, enum: ["ADMIN", "LECTURER", "STUDENT"], required: true },
  fullName: String,
  email: { type: String, unique: true },
  regNumber: String,
  staffNumber: String,
  passwordHash: String,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
