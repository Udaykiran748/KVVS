const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const BookingGenerator = sequelize.define('BookingGenerator', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  booking_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  kw_capacity: { type: DataTypes.INTEGER, allowNull: true },
  customer_name: { type: DataTypes.STRING, allowNull: true },
  mobile_number: { type: DataTypes.STRING, allowNull: true },
  email_address: { type: DataTypes.STRING, allowNull: true },
  company_name: { type: DataTypes.STRING, allowNull: true },
  booking_date: { type: DataTypes.DATEONLY, allowNull: true },
  start_time: { type: DataTypes.STRING, allowNull: true },
  end_time: { type: DataTypes.STRING, allowNull: true },
  number_of_days: { type: DataTypes.INTEGER, allowNull: true },
  delivery_address: { type: DataTypes.TEXT, allowNull: true },
  city: { type: DataTypes.STRING, allowNull: true },
  state: { type: DataTypes.STRING, allowNull: true },
  pincode: { type: DataTypes.STRING, allowNull: true },
  fuel_required: { type: DataTypes.STRING, allowNull: true },
  operator_required: { type: DataTypes.STRING, allowNull: true },
  backup_generator_required: { type: DataTypes.STRING, allowNull: true },
  special_instructions: { type: DataTypes.TEXT, allowNull: true },
  payment_method: { type: DataTypes.STRING, allowNull: true },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending' // pending, confirmed, cancelled
  }
}, {
  tableName: 'booking_generators',
  timestamps: true
});

module.exports = BookingGenerator;
