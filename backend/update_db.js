const { sequelize, Product } = require('./src/models');
require('dotenv').config();

async function updateDb() {
  try {
    await sequelize.authenticate();
    
    // Update the 6 KW Generator
    await Product.update(
      { name: 'Resources Free Generator-6 Magnet Generator' },
      { where: { name: 'Resources Free Generator-6' } }
    );
    
    // Update the 40 KW Generator
    await Product.update(
      { name: 'Energy Booster System-40 Magnet Generator' },
      { where: { name: 'Energy Booster System-40' } }
    );

    console.log('Database updated successfully with "Magnet Generator" suffixes!');
    process.exit(0);
  } catch (error) {
    console.error('Error updating database:', error);
    process.exit(1);
  }
}

updateDb();
