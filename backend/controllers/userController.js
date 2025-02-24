const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Signup user
const signup = async (req, res) => {
  try {
    const { email, password, username, plan } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword, username, plan });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '1d' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

// Forgot password (simple example, not fully implemented)
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Email not found' });
    }

    // Logic for sending reset password email would go here
    // (you can use a service like Nodemailer or SendGrid to send the reset link)
    const resetToken = jwt.sign({ id: user._id }, 'your-jwt-secret', { expiresIn: '15m' });

    // For simplicity, we'll just return the reset token
    const resetLink = `http://localhost:3000/user/reset-password/${resetToken}`;
    
    res.status(200).json({ message: 'Password reset link sent to your email', resetLink });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ error: 'Failed to process forgot password' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization?.split(" ")[1]; // e.g., "Bearer <token>"
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.SECRET); // Replace with your JWT secret
    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    // Fetch the user from the database
    const user = await User.findById(decoded.id).select("-password"); // Exclude the password field
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Return the user's details
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

module.exports = { signup, login, forgotPassword, getCurrentUser,getAllUsers };
    