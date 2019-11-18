const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chapterSchema = new mongoose.Schema({
  courseId: Number,
  chapterId: Number,
  chapterTitle: String,
  chapterOrder: Number,
  email:String
});

module.exports = mongoose.model('chapterDetails', chapterSchema);