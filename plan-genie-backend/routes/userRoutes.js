const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Signup route
router.post("/", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Google Sign-In route
router.post("/google", async (req, res) => {
  const { name, email, googleId } = req.body;
  try {
    if (!name || !email || !googleId) {
      return res.status(400).json({ error: "Missing Google user data" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: googleId, // Just stored to fulfill schema; not used
      });
      await user.save();
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
