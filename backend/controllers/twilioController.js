const https = require('https');
const User = require('../models/userModel');

// Utility function to make the API request to vapi.ai
const addPhoneNumberToVapi = (accountSid, authToken, phoneNumber) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      provider: 'twilio',
      number: phoneNumber,
      twilioAccountSid: accountSid,
      twilioAuthToken: authToken,
    });

    const options = {
      hostname: 'api.vapi.ai',
      path: '/phone-number',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 9b26bc28-8d6e-486a-9580-ae6666bcfc7e',  // Replace with your actual Bearer token
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data),
      },
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const responseJson = JSON.parse(responseData);
          resolve(responseJson);
        } catch (err) {
          reject(err);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
};

// Set or add a Twilio number for the user and register it to vapi.ai
const addTwilioNumber = async (req, res) => {
  try {
    const { accountSid, authToken, label, phoneNumber } = req.body;
    const userId = req.user.id;  // Assume the user is authenticated via JWT

    // Find the user and add the new Twilio number to their account
    const user = await User.findById(userId);
    const vapiResponse = await addPhoneNumberToVapi(accountSid, authToken, phoneNumber);

    // Add the number along with the received ID to the user's record
    user.twilioNumbers.push({
      id: vapiResponse.id,  // Store the ID returned by vapi.ai
      accountSid,
      authToken,
      label,
      phoneNumber,
    });

    await user.save();

    res.status(200).json({ message: 'Twilio number added successfully', vapiResponse });
  } catch (error) {
    console.error('Error adding Twilio number:', error);
    res.status(500).json({ error: 'Failed to add Twilio number' });
  }
};

// List all Twilio numbers for the user
const listTwilioNumbers = async (req, res) => {
  try {
    const userId = req.user.id;  // Assume the user is authenticated via JWT

    // Find the user and get their Twilio numbers
    const user = await User.findById(userId);
    res.status(200).json(user.twilioNumbers);
  } catch (error) {
    console.error('Error fetching Twilio numbers:', error);
    res.status(500).json({ error: 'Failed to fetch Twilio numbers' });
  }
};

module.exports = { addTwilioNumber, listTwilioNumbers };
