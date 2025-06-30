const mongoose = require('mongoose');

const weeklyTaskSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  weekNumber: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  dueDate: Date
}, { timestamps: true });

module.exports = mongoose.model('WeeklyTask', weeklyTaskSchema);
