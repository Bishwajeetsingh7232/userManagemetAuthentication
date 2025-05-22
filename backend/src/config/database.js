const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5445,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'utdude369',
  database: process.env.DB_NAME || 'user_access_management',
  logging: false,
});

module.exports = sequelize; 