const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const bcrypt = require("bcrypt");

/* ---------------- CREATE LECTURER ---------------- */
exports.createLecturer = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const lecturer = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "lecturer"
        });

        res.status(201).json({ message: "Lecturer created", lecturer });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create lecturer" });
    }
};

/* ---------------- CREATE STUDENT ---------------- */
exports.createStudent = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ message: "All fields required" });

        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const student = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "student"
        });

        res.status(201).json({ message: "Student created", student });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create student" });
    }
};

/* ---------------- CREATE COURSE ---------------- */
exports.createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title) return res.status(400).json({ message: "Title required" });

        const course = await Course.create({ title, description });

        res.status(201).json({ message: "Course created", course });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to create course" });
    }
};

/* ---------------- ENROLL STUDENT ---------------- */
exports.enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;
        if (!studentId || !courseId)
            return res.status(400).json({ message: "StudentId & CourseId required" });

        const alreadyEnrolled = await Enrollment.findOne({ studentId, courseId });
        if (alreadyEnrolled)
            return res.status(400).json({ message: "Student already enrolled" });

        const enrollment = await Enrollment.create({ studentId, courseId });

        res.status(201).json({ message: "Student enrolled", enrollment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to enroll student" });
    }
};
