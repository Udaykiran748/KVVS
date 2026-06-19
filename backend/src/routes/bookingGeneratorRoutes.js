const express = require('express');
const router = express.Router();
const bookingGeneratorController = require('../controllers/bookingGeneratorController');
const { verifyToken } = require('../middleware/authMiddleware');

// Protected User Booking History Ledger Route
router.get('/history', verifyToken, bookingGeneratorController.getUserBookings);

// Search Booking Route
router.post('/search', bookingGeneratorController.searchBookings);

module.exports = router;
