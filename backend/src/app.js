const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingGeneratorRoutes = require('./routes/bookingGeneratorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for dynamic deployment
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Public Files (Uploads)
app.use(express.static(path.join(__dirname, '../public')));

// API Mounting Gates
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingGeneratorRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Root Status Check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    service: 'Quantum Generator Launch Event API'
  });
});

// 404 Fallback Handlers
app.use((req, res, next) => {
  res.status(404).json({ message: 'Requested quantum terminal endpoint not found.' });
});

// Centralized Error Handling Middlewares
app.use((err, req, res, next) => {
  console.error('Unhandled Global Exception:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Quantum core runtime error occurred.'
  });
});

module.exports = app;
