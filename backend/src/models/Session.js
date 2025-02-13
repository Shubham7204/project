const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  report: {
    categories: [{
      category: String,
      score: Number,
      percentage: Number,
      matchedKeywords: [String]
    }],
    keywords: [String],
    urls: [{
      url: String,
      title: String,
      keywords: [String],
      summary: String
    }],
    concerns: [String],
    recommendations: [String],
    learningProgress: {
      newKeywords: Number,
      categoriesUpdated: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Session', sessionSchema); 