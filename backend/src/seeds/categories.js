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
      'data science',
      'IoT'
    ],
    baseUrls: [
      'https://techcrunch.com',
      'https://wired.com',
      'https://github.com',
      'https://developer.mozilla.org',
      'https://aws.amazon.com'
    ]
  },
  {
    name: 'Business & Finance',
    description: 'Content about business strategy, finance, and market analysis',
    baseKeywords: [
      'market analysis',
      'investment',
      'startup',
      'entrepreneurship',
      'finance',
      'economics',
      'strategy'
    ],
    baseUrls: [
      'https://bloomberg.com',
      'https://forbes.com',
      'https://wsj.com',
      'https://finance.yahoo.com',
      'https://investopedia.com'
    ]
  },
  {
    name: 'Health & Medicine',
    description: 'Medical research, healthcare, and wellness content',
    baseKeywords: [
      'medical research',
      'healthcare',
      'clinical trials',
      'wellness',
      'medicine',
      'public health',
      'nutrition'
    ],
    baseUrls: [
      'https://who.int',
      'https://nih.gov',
      'https://mayoclinic.org',
      'https://webmd.com',
      'https://medlineplus.gov'
    ]
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

const seedCategories = async () => {
  try {
    // Clear existing categories
    await Category.deleteMany({});

    // Add metadata to each category
    const categoriesWithMetadata = categories.map(category => ({
      ...category,
      metadata: {
        totalDocuments: 0,
        lastUpdated: new Date(),
        averageConfidence: 0
      },
      learningData: [],
      urlLearningData: []
    }));

    // Insert new categories
    await Category.insertMany(categoriesWithMetadata);
    console.log('Categories seeded successfully!');
  } catch (error) {
    console.error('Error seeding categories:', error);
    throw error;
  }
};

module.exports = seedCategories; 