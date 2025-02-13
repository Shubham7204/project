const express = require('express');
const Category = require('../models/Category');
const Session = require('../models/Session');
const auth = require('../middleware/auth');
const natural = require('natural');

const router = express.Router();
const tokenizer = new natural.WordTokenizer();

// Helper function to extract keywords from text
const extractKeywords = (text) => {
  const tokens = tokenizer.tokenize(text.toLowerCase());
  // Remove common words and short tokens
  return tokens.filter(token => 
    token.length > 3 && 
    !natural.stopwords.includes(token)
  );
};

// Helper function to calculate category match
const calculateCategoryMatch = (keywords, category) => {
  let matchScore = 0;
  let matchedKeywords = [];

  // Check base keywords
  category.baseKeywords.forEach(baseKeyword => {
    if (keywords.includes(baseKeyword.toLowerCase())) {
      matchScore += 1;
      matchedKeywords.push(baseKeyword);
    }
  });

  // Check learned keywords
  category.learningData.forEach(learned => {
    if (keywords.includes(learned.keyword.toLowerCase())) {
      matchScore += learned.confidence;
      matchedKeywords.push(learned.keyword);
    }
  });

  return {
    score: matchScore,
    matchedKeywords
  };
};

// Create new session and update learning data
router.post('/', auth, async (req, res) => {
  try {
    const { content, report } = req.body;
    
    // Create new session
    const session = new Session({
      user: req.user._id,
      content,
      report
    });
    await session.save();

    // Update category learning data
    const categories = await Category.find();
    await Promise.all(report.categories.map(async (categoryMatch) => {
      const category = categories.find(c => c.name === categoryMatch.category);
      if (category) {
        await category.updateLearningData(
          categoryMatch.matchedKeywords,
          {
            text: content.substring(0, 200),
            urls: report.urls.map(u => u.url)
          }
        );
      }
    }));

    res.json(session);
  } catch (error) {
    console.error('Session save error:', error);
    res.status(500).json({ message: 'Failed to save session' });
  }
});

// Get user's sessions
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 