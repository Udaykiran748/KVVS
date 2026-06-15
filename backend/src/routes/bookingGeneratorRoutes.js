const express = require('express');
const router = express.Router();
const bookingGeneratorController = require('../controllers/bookingGeneratorController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected User Booking History Ledger Route
router.get('/history', verifyToken, bookingGeneratorController.getUserBookings);

module.exports = router;
