const { Event } = require('../models');

/**
 * Fetch details of the active launch event.
 * If none exists, creates a seed launch event so the application functions out-of-the-box.
 */
const getActiveEvent = async (req, res) => {
  try {
    let event = await Event.findOne({ order: [['date', 'ASC']] });
    
    if (!event) {
      // Seed a default futuristic launch event set in the near future (e.g. November 2026)
      const launchDate = new Date();
      launchDate.setDate(launchDate.getDate() + 90); // 90 days from now

      event = await Event.create({
        title: 'THE QUANTUM DYNAMO: Fuel-Free Magnetic Generator Global Unveiling',
        description: 'Join Quantum Power Industries for a live, multi-sensory demonstration of our state-of-the-art zero-point magnetic-power electricity generators. Experience fully autonomous, fuel-less kilowatt systems in real-world environments. Attendees with boarding passes will receive Level-1 clearance, hands-on cell access, and early product reservation rights.',
        date: launchDate,
        venue: 'Quantum Dome Alpha, Area 51, NV',
        ticket_price: 2500.00, // 2500 INR entry booking fee
        total_slots: 500,
        available_slots: 500
      });
    }
    const { BookingGenerator } = require('../models');
    const confirmedBookings = await BookingGenerator.count({ where: { status: 'confirmed' } });
    const eventData = event ? event.toJSON() : {};
    eventData.bookedSlots = 100 + confirmedBookings;

    return res.json(eventData);
  } catch (error) {
    console.error('Fetch Event Error:', error);
    return res.status(500).json({ message: 'Failed to retrieve launch event parameters.' });
  }
};

/**
 * Update launch event parameters (Admin-only).
 */
const updateActiveEvent = async (req, res) => {
  try {
    const { title, description, date, venue, ticket_price, total_slots, available_slots, terms_and_conditions } = req.body;
    let event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Launch event not found.' });
    }

    await event.update({
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      venue: venue || event.venue,
      ticket_price: ticket_price ? parseFloat(ticket_price) : event.ticket_price,
      total_slots: total_slots ? parseInt(total_slots) : event.total_slots,
      available_slots: available_slots ? parseInt(available_slots) : event.available_slots,
      terms_and_conditions: terms_and_conditions !== undefined ? terms_and_conditions : event.terms_and_conditions
    });

    return res.json({
      message: 'Launch event updated successfully.',
      event
    });
  } catch (error) {
    console.error('Update Event Error:', error);
    return res.status(500).json({ message: 'Failed to update launch event.' });
  }
};

module.exports = {
  getActiveEvent,
  updateActiveEvent
};
