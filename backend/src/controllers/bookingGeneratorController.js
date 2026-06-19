const { BookingGenerator, Payment, Pass, Product, Event } = require('../models');
const { Op } = require('sequelize');
/**
 * Retrieve booking history ledger for the logged-in attendee.
 */
const getUserBookings = async (req, res) => {
  try {
    const user_id = req.user.id;

    const bookings = await BookingGenerator.findAll({
      where: { user_id },
      include: [
        { model: Product },
        { model: Event },
        { model: Payment },
        { model: Pass }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(bookings);
  } catch (error) {
    console.error('Fetch User Bookings Error:', error);
    return res.status(500).json({ message: 'Failed to retrieve booking history ledger.' });
  }
};

/**
 * Search bookings by name or email.
 */
const searchBookings = async (req, res) => {
  try {
    const { query } = req.body;
    let whereClause = {};
    if (query && query.trim() !== '') {
      whereClause = {
        [Op.or]: [
          { customer_name: { [Op.like]: `%${query}%` } },
          { email_address: { [Op.like]: `%${query}%` } }
        ]
      };
    }

    const bookings = await BookingGenerator.findAll({
      where: whereClause,
      include: [
        { model: Product },
        { model: Event },
        { model: Payment },
        { model: Pass }
      ],
      order: [['createdAt', 'DESC']]
    });

    return res.json(bookings);
  } catch (error) {
    console.error('Search Bookings Error:', error);
    return res.status(500).json({ message: 'Failed to search booking history.' });
  }
};

module.exports = {
  getUserBookings,
  searchBookings
};
