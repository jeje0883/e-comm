//[SECTION] Activity: Dependencies and Modules
const express = require("express");
const courseController = require("../controllers/course");
const auth = require("../auth");

const { verify, verifyAdmin } = auth;

//[SECTION] Activity: Routing Component
const router = express.Router();

//[SECTION] Activity: Route for creating a course
// router.post("/", verify, verifyAdmin, (req,res)=>{
//     courseController.addCourse(req.body).then(resultFromController => res.send(resultFromController));
// }); 


router.post("/", verify, verifyAdmin, courseController.addCourse)



//[SECTION] Activity: Route for retrieving all courses
router.get("/all", (req,res)=>{
    courseController.getAllCourses().then(resultFromController => res.send(resultFromController));
}); 

//[SECTION] Activity: Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;