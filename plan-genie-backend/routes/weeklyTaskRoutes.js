const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasksByGoal,
  updateTask,
  deleteTask
} = require('../controllers/weeklyTaskController');

router.post('/', createTask);
router.get('/', getTasksByGoal);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
