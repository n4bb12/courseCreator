const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  courseId: {type: String , unique: true},  
  email: { type: String},
  name: { type: String},
  courseName: { type: String, required: true},
  coursePrice: Number,
  courseDuration: String
});

module.exports = mongoose.model('enrolledCourses', EnrollmentSchema);