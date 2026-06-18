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
          price: 95000.00,
          availability_status: 'available',
          image_url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
          specifications: {
            dimensions: '75cm x 55cm x 60cm',
            weight: '82 Kg',
            output_voltage: '220V - 240V AC Single Phase',
            magnet_type: 'Hyper-Coercive Samarium Cobalt',
            estimated_lifespan: '30 Years',
            cooling_system: 'Liquid Zero-Viscosity Conduction'
          },
          benefits: [
            'Powers standard 3-bedroom household completely',
            'Seamless automated grid switching built-in',
            'Weatherproof rugged armor shell for outdoor placement',
            'Smart control console with IoT tracking app'
          ]
        },
        {
          name: 'Energy Booster System-40 Magnet Generator',
          kw_capacity: 40,
          price: 180000.00,
          availability_status: 'available',
          image_url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=800&auto=format&fit=crop',
          specifications: {
            dimensions: '110cm x 85cm x 90cm',
            weight: '148 Kg',
            output_voltage: '415V Three Phase / 240V Single Phase',
            magnet_type: 'Superconducting Cryo-Magnetic Ring',
            estimated_lifespan: '40 Years',
            cooling_system: 'Helium-Enriched closed circuit'
          },
          benefits: [
            'Industrial-grade energy output for manufacturing or estates',
            'Dual linking system allows scaling by parallel connections',
            'Advanced anti-shock safety systems and surge gates',
            'Real-time automated diagnostic telemetry transmission'
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
sequelize.sync({ force: false }) // Preserves existing user profiles and passes
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

// Triggering nodemon restart
