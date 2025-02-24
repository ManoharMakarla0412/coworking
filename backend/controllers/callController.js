const CallLog = require('../models/calllogsModel');

exports.createCall = async (req, res) => {
  try {
    const { assistantId, phoneNumberId, name, customerNumber } = req.body;

    // Validate required fields
    if (!assistantId || !phoneNumberId || !name || !customerNumber) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Call the VAPI API
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CALL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId,
        phoneNumberId,
        name,
        customer: {
          number: customerNumber,
        },
      }),
    });

    const result = await response.json();

    // Check if the VAPI call was successful
    if (!response.ok) {
      console.error('VAPI Error:', result);
      return res.status(response.status).json({ error: 'Failed to create call', details: result });
    }

    // Save the response to MongoDB
    const newCallLog = new CallLog(result);
    await newCallLog.save();

    res.status(201).json({
      message: 'Call created successfully',
      callLog: newCallLog,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
};


exports.getCallLogs = async (req, res) => {
  try {
    // Fetch call logs from VAPI
    const response = await fetch('https://api.vapi.ai/call', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.VAPI_TOKEN}`, // Pass your VAPI token
      },
    });

    const result = await response.json();

    // Check if the API request was successful
    if (!response.ok) {
      console.error('VAPI Error:', result);
      return res.status(response.status).json({ error: 'Failed to fetch call logs', details: result });
    }

    // Send the response to the client
    res.status(200).json({
      message: 'Call logs retrieved successfully',
      callLogs: result,
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred', details: error.message });
  }
};