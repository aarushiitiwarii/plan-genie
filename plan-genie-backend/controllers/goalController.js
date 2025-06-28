const Goal = require('../models/goal');

// Create a new goal
exports.createGoal = async (req, res) => {
  try {
    console.log("📥 Incoming goal:", req.body); // Optional debug
    const goal = new Goal(req.body); // Automatically maps domain, course, weeks, learning
    await goal.save();
    res.status(201).json(goal);
  } catch (err) {
    console.error("❌ Error saving goal:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all goals (optional filter by userId if needed later)
exports.getGoals = async (req, res) => {
  try {
    const goals = await Goal.find().sort({ createdAt: -1 });
    res.json(goals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a goal
exports.updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedGoal = await Goal.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedGoal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a goal
exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;
    await Goal.findByIdAndDelete(id);
    res.json({ message: 'Goal deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
