const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseId: {type: String , unique: true},  
  email: { type: String},
  authorName: { type: String},
  courseName: { type: String, required: true},
  courseSubtitle: { type: String},
  courseDesc: { type: String, required: true},
  coursePrice: { type: Number, required: true},
  courseDuration: { type: String, required: true},
  status: String
});

module.exports = mongoose.model('courseDetails', courseSchema);