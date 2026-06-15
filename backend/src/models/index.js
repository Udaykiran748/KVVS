const sequelize = require('../config/database');
const User = require('./User');
const Admin = require('./Admin');
const Product = require('./Product');
const Event = require('./Event');
const BookingGenerator = require('./BookingGenerator');
const Payment = require('./Payment');
const Pass = require('./Pass');
const Attendance = require('./Attendance');

// 1. User <-> BookingGenerator
User.hasMany(BookingGenerator, { foreignKey: 'user_id', onDelete: 'CASCADE' });
BookingGenerator.belongsTo(User, { foreignKey: 'user_id' });

// 2. Product <-> BookingGenerator
Product.hasMany(BookingGenerator, { foreignKey: 'product_id', onDelete: 'CASCADE' });
BookingGenerator.belongsTo(Product, { foreignKey: 'product_id' });

// 3. Event <-> BookingGenerator
Event.hasMany(BookingGenerator, { foreignKey: 'event_id', onDelete: 'CASCADE' });
BookingGenerator.belongsTo(Event, { foreignKey: 'event_id' });

// 4. BookingGenerator <-> Payment
BookingGenerator.hasOne(Payment, { foreignKey: 'booking_generator_id', onDelete: 'CASCADE' });
Payment.belongsTo(BookingGenerator, { foreignKey: 'booking_generator_id' });

// 5. BookingGenerator <-> Pass
BookingGenerator.hasOne(Pass, { foreignKey: 'booking_generator_id', onDelete: 'CASCADE' });
Pass.belongsTo(BookingGenerator, { foreignKey: 'booking_generator_id' });

// 6. Pass <-> Attendance
Pass.hasMany(Attendance, { foreignKey: 'pass_id', onDelete: 'CASCADE' });
Attendance.belongsTo(Pass, { foreignKey: 'pass_id' });

// 7. Admin <-> Attendance (as auditor/gatekeeper)
Admin.hasMany(Attendance, { foreignKey: 'scanned_by', onDelete: 'CASCADE' });
Attendance.belongsTo(Admin, { foreignKey: 'scanned_by' });

module.exports = {
  sequelize,
  User,
  Admin,
  Product,
  Event,
  BookingGenerator,
  Payment,
  Pass,
  Attendance
};
