const express = require('express');
const router = express.Router();
const {
  createGoal,
  getGoals,
  updateGoal,
  deleteGoal
} = require('../controllers/goalController');

router.post('/', createGoal);
router.get('/', getGoals);
router.patch('/:id', updateGoal);
router.delete('/:id', deleteGoal);

module.exports = router;
