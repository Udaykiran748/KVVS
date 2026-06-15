const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pass = sequelize.define('Pass', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  booking_generator_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  pass_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  qr_code_url: {
    type: DataTypes.TEXT, // Using TEXT since Data URIs are long base64 strings
    allowNull: false
  },
  pdf_url: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'passes',
  timestamps: true
});

module.exports = Pass;
