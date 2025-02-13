const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all categories
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add keyword to category learning data
router.post('/:categoryId/keywords', auth, async (req, res) => {
  try {
    const { keyword } = req.body;
    const category = await Category.findById(req.params.categoryId);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const existingKeyword = category.learningData.find(k => k.keyword === keyword);
    if (existingKeyword) {
      existingKeyword.frequency += 1;
      existingKeyword.lastUpdated = new Date();
    } else {
      category.learningData.push({
        keyword,
        frequency: 1,
        lastUpdated: new Date()
      });
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 