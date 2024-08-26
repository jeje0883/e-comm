const express = require("express");
const courseController = require("../controllers/course");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

const router = express.Router();

// Route for creating a course
router.post("/", verify, verifyAdmin, courseController.addCourse);

// Route to show all courses
router.get("/all", verify, verifyAdmin, courseController.getAllCourses);

// Route to Get Active Courses
router.get("/", courseController.getAllActive);

// Route to get Specific Course
router.get("/specific/:id", courseController.getCourse);

// Route to Update Course by ID
router.patch("/:id", verify, verifyAdmin, courseController.updateCourse);

// Route to Archive Course
router.patch("/:id/archive", verify, verifyAdmin, courseController.archiveCourse);

// Route to Activate Course
router.patch("/:id/activate", verify, verifyAdmin, courseController.activateCourse);



module.exports = router;