
const User = require('../models/User'); // Ensure the User model is correctly defined and imported
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/mailer');

// Environment variables (make sure to define these in your .env file)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'admin_secret_key';

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    res.json({ token, isAdmin: user.isAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// User registration
const registerUser = async (req, res) => {
  const { name, email, password, contact_no } = req.body;

  console.log('Received data:', req.body); // Log received data

  if (!name || !email || !password || !contact_no) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: "",
      contact_no // Add the contact number here
    });

    // Save the user to the database
    await newUser.save();

    await sendEmail(email, 'Welcome to CRM App', 'Thank you for registering');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error); // Log the error
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Registration
const registerAdmin = async (req, res) => {
  const { name, email, password,contact_no, secret } = req.body;

  // Example check: a secret key for admin registration
  if (secret !== ADMIN_SECRET) {
      return res.status(401).json({ msg: 'Unauthorized action' });
  }

  try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ msg: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new User({
          name,
          email,
          password: hashedPassword,
          contact_no,
          isAdmin: true // Mark this user as admin
      });

      await newAdmin.save();
      res.status(201).json({ msg: 'Admin registered successfully' });
  } catch (error) {
      res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Admin Login
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
      const admin = await User.findOne({ email });
      if (!admin || !admin.isAdmin) {
          return res.status(401).json({ msg: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
          return res.status(401).json({ msg: 'Invalid credentials' });
      }

      const token = jwt.sign({ userId: admin._id, isAdmin: admin.isAdmin }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ token });
  } catch (error) {
      res.status(500).json({ msg: 'Server error', error: error.message });
  }
};

// Token verification
const verifyToken = (req, res) => {
    const token = req.header('x-auth-token');
  
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      res.json({ userId: decoded.userId });
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid', error: error.message });
    }
  };

module.exports = {
  loginUser,
  registerUser,
  verifyToken,
  loginAdmin,
  registerAdmin
};
