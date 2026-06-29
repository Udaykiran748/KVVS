const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('Database Config: Connecting to MySQL database...');
const sequelize = new Sequelize(
  process.env.DB_NAME || 'kvvsai_electronic_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

module.exports = sequelize;
