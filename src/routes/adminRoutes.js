const express = require("express");
const router = express.Router();
const {
    createLecturer,
    createStudent,
    createCourse,
    enrollStudent
} = require("../controllers/adminController");

const { protect, allowRoles } = require("../middlewares/security");

router.use(protect, allowRoles("admin"));

router.post("/lecturer", createLecturer);
router.post("/student", createStudent);
router.post("/course", createCourse);
router.post("/enroll", enrollStudent);

module.exports = router;
