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
    contexts: [{
      text: String,
      relevance: String,
      timestamp: { type: Date, default: Date.now }
    }]
  }],
  urlLearningData: [{
    url: String,
    frequency: { type: Number, default: 1 },
    confidence: Number,
    lastUsed: { type: Date, default: Date.now },
    contexts: [{
      text: String,
      relevance: String,
      timestamp: { type: Date, default: Date.now }
    }]
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
categorySchema.methods.updateLearningData = async function(newKeywords, newUrls) {
  const now = new Date();

  // Update keywords
  for (const newKeyword of newKeywords) {
    const existingKeyword = this.learningData.find(k => k.keyword === newKeyword.keyword);
    
    if (existingKeyword) {
      existingKeyword.frequency += 1;
      existingKeyword.confidence = (existingKeyword.confidence + newKeyword.confidence) / 2;
      existingKeyword.lastUsed = now;
      existingKeyword.contexts.push({
        text: newKeyword.context.text,
        relevance: newKeyword.context.relevance,
        timestamp: now
      });
    } else {
      this.learningData.push({
        ...newKeyword,
        contexts: [{
          text: newKeyword.context.text,
          relevance: newKeyword.context.relevance,
          timestamp: now
        }]
      });
    }
  }

  // Update URLs
  for (const newUrl of newUrls) {
    const existingUrl = this.urlLearningData.find(u => u.url === newUrl.url);
    
    if (existingUrl) {
      existingUrl.frequency += 1;
      existingUrl.confidence = (existingUrl.confidence + newUrl.confidence) / 2;
      existingUrl.lastUsed = now;
      existingUrl.contexts.push({
        text: newUrl.context.text,
        relevance: newUrl.context.relevance,
        timestamp: now
      });
    } else {
      this.urlLearningData.push({
        ...newUrl,
        contexts: [{
          text: newUrl.context.text,
          relevance: newUrl.context.relevance,
          timestamp: now
        }]
      });
    }
  }

  // Update metadata
  this.metadata.totalDocuments += 1;
  this.metadata.lastUpdated = now;
  this.metadata.averageConfidence = this.learningData.reduce(
    (acc, curr) => acc + curr.confidence, 0
  ) / this.learningData.length;

  await this.save();
};

module.exports = mongoose.model('Category', categorySchema); 