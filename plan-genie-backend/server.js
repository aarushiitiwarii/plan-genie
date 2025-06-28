const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');
const weeklyTaskRoutes = require('./routes/weeklyTaskRoutes'); // ✅ New

app.use('/api/users', userRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/tasks', weeklyTaskRoutes); // ✅ New

// Basic test route
app.get('/', (req, res) => {
  res.send('PlanGenie API is running');
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
