const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contentSchema = new mongoose.Schema({
  courseId: String,
  chapterId: String,
  contentId: String,
  contentOrder: Number,
  contentTitle: String,
  contentType: String,
  content: String
});

module.exports = mongoose.model('contentDetails', contentSchema);