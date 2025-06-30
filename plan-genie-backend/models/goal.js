const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  domain: { type: String, required: true },
  course: { type: String, required: true },
  weeks: { type: String, required: true },
  learning: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);
