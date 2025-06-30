const WeeklyTask = require('../models/weeklyTask');

// Create a task
exports.createTask = async (req, res) => {
  try {
    const task = new WeeklyTask(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all tasks for a goal
exports.getTasksByGoal = async (req, res) => {
  try {
    const { goalId } = req.query;
    const tasks = await WeeklyTask.find({ goalId }).sort({ weekNumber: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await WeeklyTask.findByIdAndUpdate(id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await WeeklyTask.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
