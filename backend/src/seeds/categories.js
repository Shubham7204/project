const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  {
    name: 'Technology & Innovation',
    description: 'Content related to technology, software, AI, and digital innovation',
    baseKeywords: [
      'artificial intelligence',
      'machine learning',
      'blockchain',
      'cloud computing',
      'cybersecurity',
      'data science'
    ],
    baseUrls: [
      'https://www.tensorflow.org',
      'https://aws.amazon.com/machine-learning',
      'https://cloud.google.com/ai-platform'
    ],
    learningData: []
  },
  {
    name: 'Business & Finance',
    description: 'Content about business strategy, finance, and market analysis',
    baseKeywords: [
      'market analysis',
      'investment strategy',
      'financial planning',
      'risk management',
      'business development'
    ],
    baseUrls: [
      'https://www.bloomberg.com',
      'https://www.investopedia.com',
      'https://www.ft.com'
    ],
    learningData: []
  },
  {
    name: 'Healthcare & Medical',
    description: 'Medical research, healthcare technology, and patient care',
    baseKeywords: [
      'medical research',
      'healthcare technology',
      'patient care',
      'clinical trials',
      'digital health'
    ],
    baseUrls: [
      'https://www.who.int',
      'https://www.nih.gov',
      'https://www.mayoclinic.org'
    ],
    learningData: []
  },
  {
    name: 'Environmental & Sustainability',
    description: 'Content about climate change, sustainability, and environmental protection',
    baseKeywords: [
      'climate change',
      'renewable energy',
      'sustainable development',
      'carbon footprint',
      'green technology',
      'environmental protection',
      'biodiversity',
      'conservation',
      'clean energy',
      'recycling'
    ],
    learningData: [
      {
        keyword: 'carbon capture',
        frequency: 14,
        confidence: 0.78,
        lastUsed: new Date(),
        contexts: [
          {
            text: "Carbon capture technologies are essential for climate goals",
            url: "https://www.iea.org/reports/carbon-capture-utilisation-and-storage",
          }
        ]
      }
    ]
  },
  {
    name: 'Education & E-learning',
    description: 'Educational technology, learning methods, and academic content',
    baseKeywords: [
      'online learning',
      'educational technology',
      'digital literacy',
      'remote education',
      'learning management',
      'curriculum development',
      'student engagement',
      'assessment methods',
      'adaptive learning',
      'blended learning'
    ],
    learningData: [
      {
        keyword: 'microlearning',
        frequency: 16,
        confidence: 0.82,
        lastUsed: new Date(),
        contexts: [
          {
            text: "Microlearning enhances knowledge retention",
            url: "https://www.coursera.org/articles/microlearning",
          }
        ]
      }
    ]
  }
];

async function seedCategories() {
  try {
    // Clear existing categories
    await Category.deleteMany({});
    
    // Add metadata to each category
    const categoriesWithMetadata = categories.map(category => ({
      ...category,
      metadata: {
        totalDocuments: 0,
        lastUpdated: new Date(),
        averageConfidence: 0,
        version: '1.0'
      }
    }));

    // Insert new categories
    await Category.insertMany(categoriesWithMetadata);
    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
}

module.exports = seedCategories; 