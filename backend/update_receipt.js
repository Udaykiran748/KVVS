const { sequelize, BookingGenerator, Product, User, Pass, Payment } = require('./src/models');
const { generatePassPDF } = require('./src/services/pdfService');
require('dotenv').config();

async function updateReceipt() {
  try {
    await sequelize.authenticate();

    const booking = await BookingGenerator.findOne({
      where: { booking_id: 'QP-3026-817876' },
      include: [Product, User, Pass, Payment]
    });

    if (!booking) {
      console.log('Booking not found');
      process.exit(1);
    }

    // Re-generate the PDF with current DB data
    const pdfUrl = await generatePassPDF({
      user: booking.User,
      product: booking.Product,
      bookingGenerator: booking,
      payment: booking.Payment,
      booking_id: booking.booking_id,
      pass_id: booking.Pass ? booking.Pass.pass_id : `TEMP-${Math.floor(Math.random() * 1000)}`,
    });

    if (booking.Pass) {
      await booking.Pass.update({ pdf_url: pdfUrl });
    }

    console.log('PDF updated successfully! File path:', pdfUrl);
    process.exit(0);
  } catch (error) {
    console.error('Error updating receipt:', error);
    process.exit(1);
  }
}

updateReceipt();
