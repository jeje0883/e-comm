const Course = require("../models/Course");

// Create course
// module.exports.addCourse = (reqBody) => {

// 	let newCourse = new Course({
// 		name: reqBody.name,
// 		description: reqBody.description,
// 		price: reqBody.price
// 	})

// 	return newCourse.save()
// 	.then((result) => result)
// 	.catch(err => err)
// }

// Get all Courses
module.exports.getAllCourses = () => {
	return Course.find({})
	.then(result => result)
	.catch(err => err)
}

// Create course
module.exports.addCourse = (req, res) => {
	let newCourse = new Course ({
		name: req.body.name,
        description: req.body.description,
        price: req.body.price
	});
	return newCourse.save()
		.then((result) => res.send(result))
		.catch(err => err);
}