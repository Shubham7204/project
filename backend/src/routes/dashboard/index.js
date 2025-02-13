const express = require('express');
const Category = require('../../models/Category');
const Session = require('../../models/Session');
const auth = require('../../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    const stats = categories.map(category => {
      const baseKeywords = category.baseKeywords || [];
      const uniqueLearnedKeywords = [...new Set(category.learningData.map(d => d.keyword))];
      const learnedUrls = [...new Set(category.learningData.flatMap(d => d.context?.urls || []))];
      const baseUrls = category.baseUrls || [];
      const allUrls = [...new Set([...baseUrls, ...learnedUrls])];
      
      const avgConfidence = category.learningData.length > 0
        ? category.learningData.reduce((acc, curr) => acc + curr.confidence, 0) / category.learningData.length
        : 0;

      return {
        name: category.name,
        description: category.description,
        baseKeywords,
        learnedKeywordsList: uniqueLearnedKeywords,
        totalKeywords: baseKeywords.length + uniqueLearnedKeywords.length,
        learnedKeywords: uniqueLearnedKeywords.length,
        lastUpdated: category.metadata?.lastUpdated || new Date(),
        totalDocuments: category.metadata?.totalDocuments || 0,
        averageConfidence: avgConfidence,
        urls: allUrls,
        baseUrls,
        learnedUrls,
        topKeywords: category.learningData
          .sort((a, b) => b.frequency - a.frequency)
          .slice(0, 5)
          .map(k => ({
            keyword: k.keyword,
            frequency: k.frequency,
            confidence: k.confidence
          }))
      };
    });

    res.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get categories list
router.get('/categories', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
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
        contextCount: k.contexts?.length || 0
      })),
      metadata: category.metadata
    };

    res.json(learningData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 