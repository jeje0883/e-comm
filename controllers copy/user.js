const bcrypt = require("bcrypt");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const auth = require("../auth");
const { errorHandler } = require("../auth");

// Register a User
module.exports.registerUser = (req, res) => {

	if (typeof req.body.firstName !== "string" || typeof req.body.lastName !== "string") {
		return res.send(false);
	} 
	
	if (typeof req.body.email !== "string" || !req.body.email.includes("@")) {
		return res.status(400).send(false);
	} 
	
	if (req.body.password.length < 8) {
		return res.status(400).send(false);
	} 
	
	if (typeof req.body.mobileNo !== "string" || req.body.mobileNo.length !== 11) {
		return res.status(400).send(false);
	} 


	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		mobileNo: req.body.mobileNo,
		password: bcrypt.hashSync(req.body.password, 10)
	})

	return newUser.save()
	.then(user => {
		if (!user) {
			return res.status(404).send(false);
		}
		return res.status(201).send(user);
	})
	.catch(error => {
		errorHandler(error, req, res);
		return res.status(500).send(false);
	});
}

// Login User OR User Authentication
module.exports.loginUser = (req, res) => {
	if (!req.body.email.includes("@")) {
		return res.status(400).send(false);
	}


	return User.findOne({email: req.body.email})
	.then(result => {
		if (result == null) {
			return res.status(404).send(false);
		} else {
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

			if (isPasswordCorrect) {
				return res.status(201).send({access: auth.createAccessToken(result)});
			} else {
				return res.status(401).send(false);
			}
		}
	})
	.catch(error => errorHandler(error, req, res))

}



module.exports.checkEmailExists = (req, res) => {

    if(req.body.email.includes("@")){
        return User.find({ email : req.body.email })
        .then(result => {

            // if there is a duplicate email (email exists)
            if (result.length > 0) {
                return res.status(200).send(true);
            } else { // if there is no duplicate email
                return res.status(200).send(false);
            };
        })
        .catch(error => {
			errorHandler(error, req, res)
		    return res.status(500).send(false);
		});
    }
    else{
        res.status(400).send(false); // false - Invalid email
    }
};



// module.exports.checkEmailExists = (req, res) => {
//     const { email } = req.body;

//     // Validate email format
//     if (typeof req.body.email !== "string" || !req.body.email.includes("@")) {
//         return res.status(400).json({ success: false, message: "Invalid email format" });
//     }

//     // Check if email exists in the database
//     User.findOne({ email })
//         .then(user => {
//             if (user) {
//                 // Email exists
//                 return res.status(409).json({ success: true, message: "Email already exists" });
//             } else {
//                 // Email does not exist
//                 return res.status(404).json({ success: false, message: "Email not found" });
//             }
//         })
//         .catch(error => {
//             errorHandler(error, req, res);
//             return res.status(500).json({ success: false, message: "Internal server error" });
//         });
// };












// View User Details
module.exports.getProfile = (req, res) => {
	return User.findById(req.user.id)
	.then(user => {
		user.password = "";
		return res.status(206).send(user);
	})
	.catch(error => errorHandler(error, req, res))
}

// Enroll a User
module.exports.enroll = (req, res) => {

	// console.log(req.user.id);
	// console.log(req.body.enrolledCourses);

	if (req.user.isAdmin) {
		return res.status(403).send(false);
	}

	let newEnrollment = new Enrollment({
		userId: req.user.id,
		enrolledCourses: req.body.enrolledCourses,
		totalPrice: req.body.totalPrice
	});

	return newEnrollment.save()
	.then(enrolled => {
		return res.status(201).send(true);
	})
	.catch(error => errorHandler(error, req, res))
}

// Get User Enrollments
module.exports.getEnrollments = (req, res) => {

	if (req.user.isAdmin) {
		return res.status(403).send(false);
	}

	return Enrollment.find({userId: req.user.id})
	.then(enrollments => {
		if (enrollments.length > 0) {
			return res.status(200).send(enrollments);
		} else {
			return res.status(404).send(false);
		}
		
	})
	.catch(error => errorHandler(error, req, res))
}