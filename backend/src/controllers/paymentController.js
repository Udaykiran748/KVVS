const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const Razorpay = require('razorpay');
const { BookingGenerator, Payment, Pass, User, Product, Event } = require('../models');
const { generateQRCode } = require('../services/qrService');

const { sendPassEmail } = require('../services/emailService');
require('dotenv').config();

// Initialize Razorpay SDK if credentials are present
let razorpay = null;
const isDemoMode = process.env.RAZORPAY_KEY_ID === 'MOCK' || !process.env.RAZORPAY_KEY_ID;

if (!isDemoMode) {
  try {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('Payment Controller: Active Razorpay Gateway enabled.');
  } catch (error) {
    console.error('Payment Controller: Failed to initialize Razorpay SDK:', error);
  }
} else {
  console.log('Payment Controller: Razorpay Demo Mode simulation active.');
}

/**
 * Step 1: Initialize launch event registration and request Razorpay Order ID.
 */
const initiateBooking = async (req, res) => {
  try {
    const {
      product_id,
      event_id,
      kw_capacity,
      customer_name,
      mobile_number,
      email_address,
      company_name,
      delivery_address,
      city,
      state,
      pincode,
      payment_method,
      motor_condition,
      motor_age,
      motor_hp,
      generator_kw,
      generator_hp,
      generator_others,
      user_description,
      amount,
      password
    } = req.body;

    let user_id = req.user?.id;
    if (!user_id) {
      // Guest Checkout - Find or Create User
      let user = await User.findOne({ where: { email: email_address } });
      if (!user) {
        const userPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('guest123', 10);
        user = await User.create({
          name: customer_name || 'Guest User',
          email: email_address,
          mobile: mobile_number || '0000000000',
          password: userPassword,
          address: delivery_address || '',
          city: city || '',
          state: state || '',
          pincode: pincode || '',
          role: 'user'
        });
      } else if (password) {
        const userPassword = await bcrypt.hash(password, 10);
        await user.update({ password: userPassword });
      }
      user_id = user.id;
    }

    if (!product_id) {
      return res.status(400).json({ message: 'Product ID is required to register.' });
    }

    const product = await Product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ message: 'Selected generator model does not exist.' });
    }

    // Generate unique booking identifier
    const booking_id = `QP-3026-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create a pending BookingGenerator
    const bookingGenerator = await BookingGenerator.create({
      user_id,
      product_id,
      event_id,
      booking_id,
      kw_capacity,
      customer_name,
      mobile_number,
      email_address,
      company_name,
      delivery_address,
      city,
      state,
      pincode,
      payment_method,
      motor_condition,
      motor_age,
      motor_hp,
      generator_kw,
      generator_hp,
      generator_others,
      user_description,
      status: 'pending'
    });

    // Update the master User profile on checkout
    // so the latest booking details are saved.
    const user = await User.findByPk(user_id);
    if (user) {
      await user.update({
        name: customer_name || user.name,
        mobile: mobile_number || user.mobile,
        email: email_address || user.email,
        address: delivery_address || user.address,
        city: city || user.city,
        state: state || user.state,
        pincode: pincode || user.pincode
      });
    }

    const bookingAmount = amount || (product.price || 0); // Booking amount
    let order_id = `order_mock_${Math.random().toString(36).substring(2, 11)}`;

    let razorpayAmount = bookingAmount;
    if (!isDemoMode && razorpay) {
      // Create real Razorpay order (amount in paise)
      // Cap at Razorpay test mode maximum of 5,00,000 INR
      if (razorpayAmount > 499999) {
        razorpayAmount = 499999;
      }
      const options = {
        amount: Math.round(razorpayAmount * 100),
        currency: 'INR',
        receipt: booking_id
      };

      const order = await razorpay.orders.create(options);
      order_id = order.id;
    }

    // Save pending payment record in DB
    const payment = await Payment.create({
      booking_generator_id: bookingGenerator.id,
      order_id,
      amount: bookingAmount,
      status: 'pending'
    });

    return res.status(201).json({
      message: 'Booking checkout initiated.',
      booking_generator_id: bookingGenerator.id,
      booking_id,
      order_id,
      amount: isDemoMode ? bookingAmount : razorpayAmount,
      is_demo: isDemoMode,
      key_id: isDemoMode ? 'MOCK' : process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Initiate Booking Error:', error);
    return res.status(500).json({ message: 'Failed to initiate launch event checkout.', error: error.message, stack: error.stack });
  }
};

/**
 * Step 2: Verification of transaction signatures and digital pass compilation.
 */
const verifyPayment = async (req, res) => {
  try {
    const { booking_generator_id, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!booking_generator_id || !razorpay_order_id) {
      return res.status(400).json({ message: 'Booking generator parameters and Order ID are required.' });
    }

    const bookingGenerator = await BookingGenerator.findByPk(booking_generator_id, {
      include: [User, Product, Event]
    });

    if (!bookingGenerator) {
      return res.status(404).json({ message: 'Associated booking generator record not found.' });
    }

    const payment = await Payment.findOne({ where: { booking_generator_id: bookingGenerator.id, order_id: razorpay_order_id } });
    if (!payment) {
      return res.status(404).json({ message: 'Transaction record mismatch.' });
    }

    let isVerified = false;

    if (isDemoMode) {
      // Bypass standard verification in Demo Mode
      isVerified = true;
      console.log('Payment Verification: Bypassing signature check for Demo checkout.');

      await payment.update({
        transaction_id: razorpay_payment_id || `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
        status: 'captured',
        signature: 'demo_simulation_signature'
      });
    } else {
      // Live Signature verification
      if (!razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ message: 'Missing transaction capture parameters.' });
      }

      const generatedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature === razorpay_signature) {
        isVerified = true;
        await payment.update({
          transaction_id: razorpay_payment_id,
          status: 'captured',
          signature: razorpay_signature
        });
      } else {
        await payment.update({ status: 'failed' });
        await bookingGenerator.update({ status: 'cancelled' });
        return res.status(400).json({ message: 'Payment validation signature signature mismatch. Rejected.' });
      }
    }

    /*
    // Auto bypass
    isVerified = true;
    await payment.update({
      transaction_id: razorpay_payment_id || `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
      status: 'captured',
      signature: razorpay_signature || 'auto_bypassed_signature'
    });
    */

    if (isVerified) {
      // Update registration status to confirmed
      await bookingGenerator.update({ status: 'confirmed' });

      // Deduct available slots from the launch event
      const event = bookingGenerator.Event;
      if (event && event.available_slots > 0) {
        await event.update({ available_slots: event.available_slots - 1 });
      }

      // Generate a unique digital pass verification code
      const pass_id = `GENERATOR-${Math.floor(100000 + Math.random() * 900000)}`;

      // Generate base64 QR code data URL (encodes the unique Pass ID)
      const qrCodeUrl = await generateQRCode(pass_id);

      // Save pass model details
      const newPass = await Pass.create({
        booking_generator_id: bookingGenerator.id,
        pass_id,
        qr_code_url: qrCodeUrl
      });

      // Update pass with null pdf_url since we generate it on frontend
      await newPass.update({ pdf_url: null });

      // Dispatch Email with pass attachment via Nodemailer
      await sendPassEmail(
        bookingGenerator.User.email,
        bookingGenerator.User.name,
        {
          booking_id: bookingGenerator.booking_id,
          pass_id,
          product_name: bookingGenerator.Product.name,
          event_title: bookingGenerator.Event ? bookingGenerator.Event.title : 'N/A',
          event_date: bookingGenerator.Event ? bookingGenerator.Event.date : 'N/A',
          event_venue: bookingGenerator.Event ? bookingGenerator.Event.venue : 'N/A'
        }
      );

      return res.json({
        message: 'Transaction captured and boarding pass processed successfully.',
        booking_id: bookingGenerator.booking_id,
        customer_name: bookingGenerator.customer_name,
        mobile_number: bookingGenerator.mobile_number,
        email_address: bookingGenerator.email_address,
        company_name: bookingGenerator.company_name,
        delivery_address: bookingGenerator.delivery_address,
        city: bookingGenerator.city,
        state: bookingGenerator.state,
        pincode: bookingGenerator.pincode,
        payment_method: bookingGenerator.payment_method,
        motor_condition: bookingGenerator.motor_condition,
        motor_hp: bookingGenerator.motor_hp,
        generator_kw: bookingGenerator.generator_kw,
        generator_hp: bookingGenerator.generator_hp,
        generator_others: bookingGenerator.generator_others,
        user_description: bookingGenerator.user_description,
        kw_capacity: bookingGenerator.kw_capacity,
        amount: payment.amount,
        transaction_id: payment.transaction_id,
        pass: {
          id: newPass.id,
          pass_id: newPass.pass_id,
          qr_code_url: newPass.qr_code_url,
          pdf_url: newPass.pdf_url
        }
      });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error);
    return res.status(500).json({ message: 'Verification error processing transaction.' });
  }
};

const failPayment = async (req, res) => {
  try {
    const { booking_generator_id, razorpay_order_id } = req.body;

    if (booking_generator_id && razorpay_order_id) {
      await Payment.update(
        { status: 'failed' },
        { where: { booking_generator_id, order_id: razorpay_order_id } }
      );
      await BookingGenerator.update(
        { status: 'failed' },
        { where: { id: booking_generator_id } }
      );
    }

    return res.json({ message: 'Payment marked as failed.' });
  } catch (error) {
    console.error('Payment Fail Error:', error);
    return res.status(500).json({ message: 'Error marking payment as failed.' });
  }
};

module.exports = {
  initiateBooking,
  verifyPayment,
  failPayment
};
