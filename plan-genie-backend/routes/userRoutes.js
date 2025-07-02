import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// GET user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('❌ Error fetching user:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update user
router.put('/:id', async (req, res) => {
  const { name, email, bio, location, avatar, github, linkedin } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, bio, location, avatar, github, linkedin },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("❌ Error updating user:", err.message);
    res.status(500).json({ message: "Failed to update user" });
  }
});

// POST /api/users/google - Handle Google Sign-in
router.post("/google", async (req, res) => {
  try {
    const { name, email, googleId } = req.body;

    if (!email || !googleId || !name) {
      return res.status(400).json({ error: "Missing Google user data" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({ name, email });
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("❌ Google Sign-in error:", err.message);
    res.status(500).json({ error: "Google sign-in failed" });
  }
});

export default router;
