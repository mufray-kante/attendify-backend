const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const bcrypt = require("bcrypt");

/* ===========================
   CREATE LECTURER
=========================== */
exports.createLecturer = async (req, res) => {
    try {
        const { fullName, email, password, staffNumber } = req.body;

        if (!fullName || !email || !password || !staffNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const lecturer = await User.create({
            fullName,
            email,
            staffNumber,
            passwordHash,
            role: "LECTURER"
        });

        res.status(201).json({
            message: "Lecturer created successfully",
            lecturer
        });

    } catch (error) {
        console.error("Create Lecturer Error:", error);
        res.status(500).json({ message: "Server error while creating lecturer" });
    }
};


/* ===========================
   CREATE STUDENT
=========================== */
exports.createStudent = async (req, res) => {
    try {
        const { fullName, email, password, regNumber } = req.body;

        if (!fullName || !email || !password || !regNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const student = await User.create({
            fullName,
            email,
            regNumber,
            passwordHash,
            role: "STUDENT"
        });

        res.status(201).json({
            message: "Student created successfully",
            student
        });

    } catch (error) {
        console.error("Create Student Error:", error);
        res.status(500).json({ message: "Server error while creating student" });
    }
};


/* ===========================
   CREATE COURSE
=========================== */
exports.createCourse = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Course title is required" });
        }

        const course = await Course.create({
            title,
            description
        });

        res.status(201).json({
            message: "Course created successfully",
            course
        });

    } catch (error) {
        console.error("Create Course Error:", error);
        res.status(500).json({ message: "Server error while creating course" });
    }
};


/* ===========================
   ENROLL STUDENT
=========================== */
exports.enrollStudent = async (req, res) => {
    try {
        const { studentId, courseId } = req.body;

        if (!studentId || !courseId) {
            return res.status(400).json({ message: "Student ID and Course ID are required" });
        }

        const existingEnrollment = await Enrollment.findOne({
            studentId,
            courseId
        });

        if (existingEnrollment) {
            return res.status(400).json({ message: "Student already enrolled in this course" });
        }

        const enrollment = await Enrollment.create({
            studentId,
            courseId
        });

        res.status(201).json({
            message: "Student enrolled successfully",
            enrollment
        });

    } catch (error) {
        console.error("Enroll Student Error:", error);
        res.status(500).json({ message: "Server error while enrolling student" });
    }
};