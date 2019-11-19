const mongoose = require('mongoose');

const { Schema } = mongoose;

const FileSchema = new Schema({
  length: Number,
  chunkSize: Number,
  uploadDate: Date,
  filename: String,
  contentType: String,
  aliases: String,
  metadata: Object
});

module.exports = mongoose.model('fileuploads.files', FileSchema);