const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  baseKeywords: [{
    type: String,
    required: true,
  }],
  baseUrls: [{
    type: String
  }],
  learningData: [{
    keyword: {
      type: String,
      required: true,
    },
    frequency: {
      type: Number,
      default: 1
    },
    confidence: {
      type: Number,
      default: 0.5,
      min: 0,
      max: 1
    },
    lastUsed: {
      type: Date,
      default: Date.now
    },
    context: {
      text: String,
      urls: [String]
    }
  }],
  metadata: {
    totalDocuments: {
      type: Number,
      default: 0
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    },
    averageConfidence: {
      type: Number,
      default: 0
    }
  }
});

// Method to update learning data
categorySchema.methods.updateLearningData = async function(keywords, context) {
  const now = new Date();
  
  // Update existing keywords
  keywords.forEach(keyword => {
    const existingKeyword = this.learningData.find(k => k.keyword.toLowerCase() === keyword.toLowerCase());
    
    if (existingKeyword) {
      existingKeyword.frequency += 1;
      existingKeyword.lastUsed = now;
      existingKeyword.confidence = Math.min(existingKeyword.confidence + 0.1, 1);
      existingKeyword.context = context;
    } else {
      this.learningData.push({
        keyword,
        frequency: 1,
        confidence: 0.5,
        lastUsed: now,
        context
      });
    }
  });

  // Update metadata
  this.metadata.totalDocuments += 1;
  this.metadata.lastUpdated = now;
  this.metadata.averageConfidence = this.learningData.reduce((sum, k) => sum + k.confidence, 0) / this.learningData.length;

  return this.save();
};

module.exports = mongoose.model('Category', categorySchema); 