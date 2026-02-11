const express = require("express");
const router = express.Router();

const {
    createLecturer,
    createStudent,
    createCourse,
    enrollStudent
} = require("../controllers/adminController");

const { protect, allowRoles } = require("../middlewares/security");

/*
   Only ADMIN can access all routes below
*/
router.use(protect);
router.use(allowRoles("ADMIN"));

/* ---------- ADMIN ACTIONS ---------- */
router.post("/lecturer", createLecturer);
router.post("/student", createStudent);
router.post("/course", createCourse);
router.post("/enroll", enrollStudent);

module.exports = router;