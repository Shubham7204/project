require('dotenv').config();

module.exports = {
  MONGO_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/content',
  JWT_SECRET: process.env.JWT_SECRET || 'your_secret_key_here',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development'
}; 