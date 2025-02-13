const mongoose = require('mongoose');
const seedCategories = require('./categories');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/content', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');
    await seedCategories();
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run the seed if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase; 