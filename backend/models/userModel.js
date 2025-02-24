const mongoose = require('mongoose');

// Define the Twilio number schema
const twilioNumberSchema = new mongoose.Schema({
  id: { type: String, required: true },
  accountSid: { type: String, required: true },
  authToken: { type: String, required: true },
  label: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

// Define the user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  twilioNumbers: [twilioNumberSchema],  // Array of Twilio numbers for each user
  assistant: { type: Boolean, default: false },  // Reference to Assistant model
  plan: { type: String, required: true }, // Reference to
});

const User = mongoose.model('User', userSchema);

module.exports = User;
