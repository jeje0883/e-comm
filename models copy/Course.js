const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is Required']
  },
  description: {
    type: String,
    required: [true, 'Course description is Required']
  },
  price: {
    type: Number,
    required: [true, 'Course price is Required'],
    min: [0, 'Course price cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Course', courseSchema);