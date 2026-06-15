const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const productController = require('../controllers/productController');
const { verifyAdmin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// ─── Dashboard Analytics ───────────────────────────────────────
router.get('/analytics', verifyAdmin, adminController.getDashboardAnalytics);
router.get('/booking-generators', verifyAdmin, adminController.getAllBookingGenerators);

// ─── Gate Scanner ──────────────────────────────────────────────
router.post('/validate-pass', verifyAdmin, adminController.validatePass);

// ─── User Management ──────────────────────────────────────────
router.get('/users', verifyAdmin, adminController.getAllUsers);
router.put('/users/:id', verifyAdmin, adminController.updateUser);
router.delete('/users/:id', verifyAdmin, adminController.deleteUser);

// ─── Payment Management ───────────────────────────────────────
router.get('/payments', verifyAdmin, adminController.getAllPayments);
router.put('/payments/:id/status', verifyAdmin, adminController.updatePaymentStatus);

// ─── Booking Generator Management ──────────────────────────────────
router.put('/booking-generators/:id/cancel', verifyAdmin, adminController.cancelBookingGenerator);

// ─── Product Management (admin-scoped) ───────────────────────
router.get('/products', verifyAdmin, productController.getAllProducts);
router.post('/products', verifyAdmin, upload.single('image'), productController.createProduct);
router.put('/products/:id', verifyAdmin, upload.single('image'), productController.updateProduct);
router.delete('/products/:id', verifyAdmin, productController.deleteProduct);

module.exports = router;
