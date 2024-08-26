const express = require("express");
const userController = require("../controllers/user");
const { verify } = require("../auth");

const router = express.Router();

//Route for registration
router.post("/register", (req, res) => {
	userController.registerUser(req.body).then(resultFromController => res.send(resultFromController));
});

router.post("/login", (req, res) => {
	userController.loginUser(req.body).then(resultFromController => res.send (resultFromController));
});

//[SECTION] Activity: Routes for duplicate email
router.post("/check-email", (req, res) => {
    userController.checkEmailExists(req.body).then(resultFromController => res.send(resultFromController));
});


//[Section] Activity: Route for retrieving user details
router.post("/details",verify, userController.getProfile);




module.exports = router;