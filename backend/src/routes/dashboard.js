const express = require('express');
const Category = require('../models/Category');
const auth = require('../middleware/auth');

const router = express.Router();

// Get learning statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    const stats = categories.map(category => ({
      name: category.name,
      totalKeywords: category.baseKeywords.length + category.learningData.length,
      learnedKeywords: category.learningData.length,
      averageConfidence: category.metadata.averageConfidence,
      totalDocuments: category.metadata.totalDocuments,
      lastUpdated: category.metadata.lastUpdated,
      topKeywords: category.learningData
        .sort((a, b) => b.frequency - a.frequency)
        .slice(0, 5)
        .map(k => ({
          keyword: k.keyword,
          frequency: k.frequency,
          confidence: k.confidence
        }))
    }));

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed category learning data
router.get('/category/:categoryId', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const learningData = {
      baseKeywords: category.baseKeywords,
      learnedKeywords: category.learningData.map(k => ({
        keyword: k.keyword,
        frequency: k.frequency,
        confidence: k.confidence,
        lastUsed: k.lastUsed,
        contextCount: k.contexts.length
      })),
      metadata: category.metadata
    };

    res.json(learningData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 