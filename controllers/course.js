const Course = require("../models/Course");
const { errorHandler } = require("../auth");

// Create course
module.exports.addCourse = (req, res) => {

	let newCourse = new Course({
		name: req.body.name,
		description: req.body.description,
		price: req.body.price
	});

	Course.findOne({name: req.body.name})
	.then(existingCourse => {
		if (existingCourse) {
			return res.status(409).send(false);
		} else {
			return newCourse.save()
			.then(result => res.status(201).send(result))
			.catch(error => errorHandler(error, req, res))
		}
	})
	.catch(error => errorHandler(error, req, res))
}

// Get all Courses
module.exports.getAllCourses = (req, res) => {
	return Course.find({})
	.then(result => {

		if (result.length > 0) {
			return res.status(200).send(result)
		} else {
			return res.status(404).send("No courses found");
		}
	})
	.catch(error => errorHandler(error, req, res))
}

// Get all Active Courses
module.exports.getAllActive = (req, res) => {
	return Course.find({isActive: true})
	.then(result => {

		if (result.length > 0) {
			return res.status(200).send(result)
		} else { // Validation for Empty Course List
			return res.status(404).send(false); // No active course found
		}
	})
	.catch(error => errorHandler(error, req, res))
}

// Get specific course by ID
module.exports.getCourse = (req, res) => {
	return Course.findById(req.params.id)
	.then(course => {
		if (course !== null) {
			return res.status(200).send(course)
		} else {
			return res.status(404).send(false);
		}
	})
	.catch(error => errorHandler(error, req, res))
}

// Update Course by ID
module.exports.updateCourse = (req, res) => {
	return Course.findByIdAndUpdate(req.params.id, req.body, {new: true})
	.then(course => res.status(200).send(true))
	.catch(error => errorHandler(error, req, res))
}


module.exports.archiveCourse = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    return Course.findByIdAndUpdate(req.params.courseId, updateActiveField)
    .then(course => {
        if (course) {
            res.status(200).send(true);
        } else {
            res.status(404).send(false);
        }
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.activateCourse = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    return Course.findByIdAndUpdate(req.params.id, updateActiveField, {new: true})
		.then(course => {
			if (!course) {
				return res.status(404).send(false);
			}
			
			if (course.isActive) {
				// Course was successfully activated
				// return res.status(200).send("Course already activated");
				return res.status(200).send(true);
			}
			
		})
    	.catch(error => errorHandler(error, req, res));
};