const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");
const { errorHandler } = require("../auth");

// Register a User
module.exports.registerUser = (req, res) => {

	let newUser = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		mobileNo: req.body.mobileNo,
		password: bcrypt.hashSync(req.body.password, 10)
	})

	return newUser.save()
	.then(user => res.send(user))
	.catch(error => errorHandler(error, req, res))
}

// Login User OR User Authentication
module.exports.loginUser = (req, res) => {
	return User.findOne({email: req.body.email})
	.then(result => {
		if (result == null) {
			res.send(false);
		} else {
			const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

			if (isPasswordCorrect) {
				res.send({access: auth.createAccessToken(result)});
			} else {
				res.send(false);
			}
		}
	})
	.catch(error => errorHandler(error, req, res))
}

// Check if Email is in Database
module.exports.checkEmailExists = (req, res) => {
	return User.find({email: req.body.email})
	.then(result => {
		if (result.length > 0) {
			res.send(true);
		} else {
			res.send(false);
		}
	})
	.catch(error => errorHandler(error, req, res))
}

// View User Details
module.exports.getProfile = (req, res) => {
	return User.findById(req.user.id)
	.then(user => {
		user.password = "";
		res.send(user);
	})
	.catch(error => errorHandler(error, req, res))
}