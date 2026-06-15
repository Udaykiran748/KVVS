const { BookingGenerator, Payment, Pass, Product, Event } = require('../models');

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

module.exports = {
  getUserBookings
};
