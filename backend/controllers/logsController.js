const https = require('https');

// Get All Logs API
const getAllLogs = async (req, res) => {
  try {
    // VAPI API endpoint to retrieve all logs
    const options = {
      hostname: 'api.vapi.ai',
      path: '/logs', // Endpoint for retrieving logs
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_TOKEN}`, // Your VAPI token
        'Content-Type': 'application/json',
      },
    };

    // Make the HTTPS request
    const vapiRequest = https.request(options, (vapiResponse) => {
      let responseData = '';

      // Collect data chunks
      vapiResponse.on('data', (chunk) => {
        responseData += chunk;
      });

      // Handle the complete response
      vapiResponse.on('end', () => {
        try {
          // Parse and return the response data
          const vapiData = JSON.parse(responseData);
          if (vapiResponse.statusCode === 200) {
            res.status(200).json(vapiData);
          } else {
            console.error('VAPI API error:', vapiData);
            res.status(vapiResponse.statusCode).json({ error: vapiData });
          }
        } catch (err) {
          console.error('Error parsing VAPI response:', err);
          res.status(500).json({ error: 'Failed to parse VAPI response' });
        }
      });
    });

    // Handle request errors
    vapiRequest.on('error', (error) => {
      console.error('Error fetching logs from VAPI:', error);
      res.status(500).json({ error: 'Failed to retrieve logs from VAPI' });
    });

    // End the request
    vapiRequest.end();
  } catch (error) {
    console.error('Error in getAllLogs API:', error);
    res.status(500).json({ error: 'Failed to retrieve logs' });
  }
};

module.exports = { getAllLogs };
