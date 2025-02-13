const express = require('express');
const Category = require('../../models/Category');
const auth = require('../../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const categories = await Category.find();
    const stats = categories.map(category => {
      // Get unique learned keywords from learningData
      const uniqueLearnedKeywords = [...new Set(
        category.learningData.map(item => item.keyword)
      )];

      // Get URLs from contexts in learningData
      const learningDataUrls = category.learningData
        .flatMap(data => 
          data.contexts?.map(context => {
            // Extract URLs from context text
            const urlMatch = context.text.match(/(https?:\/\/[^\s]+)/);
            return urlMatch ? urlMatch[0] : null;
          })
        )
        .filter(Boolean); // Remove null values

      // Ensure unique URLs
      const uniqueUrls = [...new Set([
        ...(category.baseUrls || []),
        ...learningDataUrls
      ])];

      // Calculate average confidence
      const avgConfidence = category.learningData.length > 0
        ? category.learningData.reduce((sum, item) => sum + item.confidence, 0) / category.learningData.length
        : 0;

      return {
        name: category.name,
        description: category.description,
        totalKeywords: (category.baseKeywords || []).length + uniqueLearnedKeywords.length,
        learnedKeywords: uniqueLearnedKeywords.length,
        lastUpdated: category.metadata?.lastUpdated || new Date(),
        totalDocuments: category.metadata?.totalDocuments || 0,
        averageConfidence: avgConfidence,
        urls: uniqueUrls,
        baseUrls: category.baseUrls || [],
        learnedUrls: learningDataUrls,
        baseKeywords: category.baseKeywords || [],
        learnedKeywordsList: uniqueLearnedKeywords,
        // Additional learning stats
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
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 