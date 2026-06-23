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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User account with this email not found.' });
    }

    const crypto = require('crypto');
    const token = crypto.randomBytes(20).toString('hex');
    const expireDate = new Date(Date.now() + 3600000); // 1 hour

    await user.update({ resetPasswordToken: token, resetPasswordExpires: expireDate });

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER || 'ssquaregtechsolutions@gmail.com',
        pass: process.env.SMTP_PASS || 'pmpwvvqhzyuyvwul'
      }
    });

    const mailOptions = {
      from: 'botu35326@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
            `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
            `http://localhost:5173/login?token=${token}\n\n` +
            `If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Email sent successfully. Please check your inbox and spam.' });
  } catch (error) {
    console.error('User Forgot Password Error:', error);
    return res.status(500).json({ message: 'Internal server error during password reset.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const user = await User.findOne({ 
      where: { 
        resetPasswordToken: token,
        resetPasswordExpires: { [require('sequelize').Op.gt]: new Date() }
      } 
    });

    if (!user) {
      return res.status(400).json({ message: 'Password reset token is invalid or has expired.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ 
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null
    });

    return res.json({ message: 'Password updated successfully. You can now login.' });
  } catch (error) {
    console.error('User Reset Password Error:', error);
    return res.status(500).json({ message: 'Internal server error during password reset.' });
  }
};

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email required' });
    const user = await User.findOne({ where: { email } });
    if (user) {
      return res.json({ exists: true, message: 'this email is already used please use another email' });
    }
    return res.json({ exists: false });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

const checkMobile = async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) return res.status(400).json({ message: 'Mobile required' });
    const user = await User.findOne({ where: { mobile } });
    if (user) {
      return res.json({ exists: true, message: 'this number is already used please use another number' });
    }
    return res.json({ exists: false });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  getMe,
  adminForgotPassword,
  forgotPassword,
  resetPassword,
  checkEmail,
  checkMobile
};
