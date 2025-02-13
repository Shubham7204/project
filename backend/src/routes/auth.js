const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).json({ token, email: user.email });
  } catch (error) {
    res.status(400).json({ 
      message: error.code === 11000 ? 'Email already exists' : 'Error creating account' 
    });
  }
});

// Sign in
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = await user.generateAuthToken();
    res.json({ token, email: user.email });
  } catch (error) {
    res.status(400).json({ message: 'Login failed' });
  }
});

// Sign out
router.post('/signout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

module.exports = router; 