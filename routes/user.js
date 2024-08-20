const express = require("express");
const userController = require("../controllers/user");
const { verify } = require("../auth");

const router = express.Router();

// Route for registration
router.post("/register", userController.registerUser);

// Route for login
router.post("/login", userController.loginUser);

// Route to check email
router.post("/check-email", userController.checkEmailExists);

// Route to check user details
router.post("/details", verify, userController.getProfile);

// Route to enroll user
router.post("/enroll", verify, userController.enroll);

// Route to get enrolled courses of user
router.get("/get-enrollments", verify, userController.getEnrollments);



module.exports = router;