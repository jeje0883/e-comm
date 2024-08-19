const Course = require("../models/Course");
const { errorHandler } = require("../auth");

// Create course
module.exports.addCourse = (req, res) => {

	let newCourse = new Course({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});

	return newCourse.save()
	.then(result => res.send(result))
	.catch(error => errorHandler(error, req, res));
}

// Get all Courses
module.exports.getAllCourses = (req, res) => {
	return Course.find({})
	.then(result => res.send(result))
	.catch(error => errorHandler(error, req, res))
}

// Get all Active Courses
module.exports.getAllActive = (req, res) => {
	return Course.find({isActive: true})
	.then(result => res.send(result))
	.catch(error => errorHandler(error, req, res))
}

// Get specific course by ID
module.exports.getCourse = (req, res) => {
	return Course.findById(req.params.id)
	.then(course => res.send(course))
	.catch(error => errorHandler(error, req, res))
}

// Update Course by ID
module.exports.updateCourse = (req, res) => {
	return Course.findByIdAndUpdate(req.params.id, req.body, {new: true})
	.then(course => res.send(true))
	.catch(error => errorHandler(error, req, res))
}

// Archive a Course
module.exports.archiveCourse = (req, res) => {
	return Course.findByIdAndUpdate(req.params.id, {isActive: false}, {new: true})
	.then(course => res.send(true))
	.catch(error => errorHandler(error, req, res))
}

// Activate a Course
module.exports.activateCourse = (req, res) => {
	return Course.findByIdAndUpdate(req.params.id, {isActive: true}, {new: true})
	.then(course => res.send(true))
	.catch(error => errorHandler(error, req, res))
}