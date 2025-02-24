const express = require('express');
const router = express.Router();
const { addTwilioNumber, listTwilioNumbers } = require('../controllers/twilioController');
const { authenticateToken } = require('../utils/auth');

// Route to add a new Twilio number
router.post('/add-number', authenticateToken, addTwilioNumber);

// Route to list all Twilio numbers for the user
router.get('/list-numbers', authenticateToken, listTwilioNumbers);

module.exports = router;
