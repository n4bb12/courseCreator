const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new mongoose.Schema({
  courseId: String,
  chapterId: String,
  chapterTitle: String,
  chapterOrder: Number
});

module.exports = mongoose.model('chapterDetails', chapterSchema);