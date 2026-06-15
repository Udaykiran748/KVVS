const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Admin } = require('../models');
const { JWT_SECRET } = require('../middleware/authMiddleware');

/**
 * Register a new user account.
 */
const register = async (req, res) => {
  try {
    const { name, email, password, mobile, address, city, state, pincode } = req.body;

    if (!name || !email || !password || !mobile || !address) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if email already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email address is already in use.' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      mobile,
      address,
      city,
      state,
      pincode,
      role: 'user'
    });

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account registered successfully.',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        mobile: newUser.mobile,
        address: newUser.address,
        city: newUser.city,
        state: newUser.state,
        pincode: newUser.pincode,
        role: 'user'
      }
    });
  } catch (error) {
    console.error('Signup Error:', error);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
};

/**
 * Login standard attendee account.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        city: user.city,
        state: user.state,
        pincode: user.pincode,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

/**
 * Login admin panel portal.
 */
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ message: 'Access denied. Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Access denied. Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '2d' }
    );

    return res.json({
      message: 'Admin authorization granted.',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    console.error('Admin Login Error:', error);
    return res.status(500).json({ message: 'Internal server error during admin authentication.' });
  }
};

/**
 * Get profile statistics of currently validated JWT user.
 */
const getMe = async (req, res) => {
  try {
    const { id, role } = req.user;

    if (role === 'admin') {
      const admin = await Admin.findByPk(id, { attributes: ['id', 'name', 'email', 'role'] });
      if (!admin) return res.status(404).json({ message: 'Admin profile not found.' });
      return res.json({ user: admin });
    } else {
      const user = await User.findByPk(id, { attributes: ['id', 'name', 'email', 'mobile', 'address', 'city', 'state', 'pincode', 'role'] });
      if (!user) return res.status(404).json({ message: 'User profile not found.' });
      return res.json({ user });
    }
  } catch (error) {
    console.error('Get Me Error:', error);
    return res.status(500).json({ message: 'Internal server error resolving token.' });
  }
};

/**
 * Admin Forgot Password (direct update)
 */
const adminForgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      // Don't reveal if email exists or not for security, but we will return success anyway or specifically for this basic setup we can return 404
      return res.status(404).json({ message: 'Admin account with this email not found.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await admin.update({ password: hashedPassword });

    return res.json({ message: 'Password updated successfully. You can now login.' });
  } catch (error) {
    console.error('Admin Forgot Password Error:', error);
    return res.status(500).json({ message: 'Internal server error during password reset.' });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  adminForgotPassword
};
