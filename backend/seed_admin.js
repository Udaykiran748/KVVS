const bcrypt = require('bcryptjs');
const { Admin, sequelize } = require('./src/models');
require('dotenv').config();

async function seedAdmin() {
  try {
    // Authenticate the database connection
    await sequelize.authenticate();
    console.log('Database connected successfully.');

    const email = process.env.ADMIN_EMAIL;
    const plainPassword = process.env.ADMIN_PASSWORD;
    const name = process.env.ADMIN_NAME || 'Admin';

    if (!email || !plainPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in environment variables.');
      process.exit(1);
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ where: { email } });

    if (existingAdmin) {
      // Update the existing admin with the new hashed password
      await existingAdmin.update({ password: hashedPassword, name });
      console.log(`Admin account '${email}' updated successfully with hashed password.`);
    } else {
      // Create a new admin
      await Admin.create({
        name,
        email,
        password: hashedPassword,
        role: 'admin'
      });
      console.log(`Admin account '${email}' created successfully.`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();
