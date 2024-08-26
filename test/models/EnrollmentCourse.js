const mongoose = require('mongoose');

const enrollmentCourseSchema = new mongoose.Schema({
    enrollmentId: {
        type : String, 
        required: [true, 'Enrollment ID is required']
    },
    courseId: {
        type : String, 
        required: [true, 'Course ID is required']
    },
})

module.exports = mongoose.model('Enrollment', enrollmentCourseSchema);