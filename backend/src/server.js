const app = require('./app');
const { sequelize, User, Admin, Product, Event } = require('./models');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

/**
 * Seeder function to populate initial generator models and administrative portal access.
 */
const seedDatabase = async () => {
  try {

    // 2. Seed initial generator product lines
    const productCount = await Product.count();
    if (productCount === 0) {
      await Product.bulkCreate([

        {
          name: 'Resources Free Generator-6 Magnet Generator',
          kw_capacity: 6,
          price: 6000.00,
          availability_status: '6KW to 40KW',
          image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
          specifications: {
            availability: '6kw to 100kw output power generation',
            load_guarantee: '90%',
            applications: 'Agriculture',
            type: 'Resource-Free Generator'
          },
          benefits: [
            "A system which doesn't consumes or either needs any other Resources like *solar *water *petroleum *battery *KEB power supply To generate the electricity power.",
            "It runs on its own source which generates electricity also the maintenance is affordable compared to any other generators which are dependent on Resources mentioned above.",
            "It's availability is from 6kw to 100kw output power generation also 90% of load guaranteed on the requirement of output energy.",
            "It's applications for :- Agriculture"
          ]
        },
        {
          name: 'Energy Booster System-40 Magnet Generator',
          kw_capacity: 40,
          price: 6000.00,
          availability_status: '40KW 1MVA',
          image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
          specifications: {
            availability: '40KW to 1000KW output power supply',
            input: '10 KW from LT',
            output: '40 KW Load',
            ratio: '1:4',
            load_guarantee: '90%',
            applications: 'Commercial industries, Agricultural'
          },
          benefits: [
            "A system which consumes a input power of 10kw from the LT through the output power it distributes about 40kw load.",
            "By consumption of 10kw power it provides about 40kw load the ratio of 1:4 times of power output which the system is known as ENERGY BOOSTER.",
            "It's availability from 40kw to 1000kw output power supply also 90% load guaranteed on the requirement of output power.",
            "It's applications for :- *Commercial industries. *Agricultural"
          ]
        }
      ]);
      console.log('Seeder: High-tech generator product catalog seeded.');
    }

    // 3. Seed active launch event parameters
    const eventCount = await Event.count();
    if (eventCount === 0) {
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 45); // 45 days from today

      await Event.create({
        title: 'THE KVVSAI ELECTRICALS: Zero-Fuel Magnetic Generator Global',
        description: 'Prepare to witness the official global launch of the KVVSai electricals Series: magnetic-power electricity generators operating fully without fuel, oil, or combustion. Experience live cell tests, interact with design engineers, and secure early reservation passes at our futuristic showcase event.',
        date: launchDate,
        venue: 'KVVSai electricals Dome Alpha, Aerospace Park Tech Center, Bangalore, KA',
        ticket_price: 2500.00, // 2500 INR entry booking amount
        total_slots: 300,
        available_slots: 300
      });
      console.log('Seeder: Active launch event seeded.');
    }
  } catch (error) {
    console.error('Seeder Error during startup:', error);
  }
};

// Database connection & listener activation
sequelize.sync() // Preserves existing user profiles and passes
  .then(async () => {
    console.log('Sequelize: Database structure synchronized successfully.');
    await seedDatabase();
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server: Operating smoothly on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Sequelize: Failed to synchronize database structure:', error);
    process.exit(1);
  });

// Triggering nodemon restart!
