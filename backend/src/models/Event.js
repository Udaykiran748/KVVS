const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  venue: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ticket_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_slots: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  available_slots: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  terms_and_conditions: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'events',
  timestamps: true
});

module.exports = Event;
