const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {type: Number , unique: true},  
  email: { type: String, unique: true },
  courseName: { type: String, required: true, unique: true},
  courseSubtitle: { type: String},
  courseDesc: { type: String, required: true},
  coursePrice: { type: Number, required: true},
  courseDuration: { type: String, required: true},
  status: String
});

module.exports = mongoose.model('courseDetails', courseSchema);