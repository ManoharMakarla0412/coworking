const Token = require('../models/tokenModel');

exports.handleOAuthCallback = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const body = new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: process.env.REDIRECT_URI,
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.CALENDLY_CLIENT_ID}:${process.env.CALENDLY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body,
    };

    // Fetch token from Calendly
    const response = await fetch('https://auth.calendly.com/oauth/token', options);
    const data = await response.json();

    if (!response.ok) {
      console.error('Error fetching token:', data);
      return res.status(response.status).json({
        error: data.error || 'Failed to exchange authorization code',
      });
    }

    const { access_token, refresh_token, token_type, expires_in, created_at, scope, owner, organization } = data;

    // Save the tokens to the database
    const tokenDoc = await Token.findOneAndUpdate(
      { owner }, // Find by owner URL
      { access_token, refresh_token, token_type, expires_in, created_at, scope, organization },
      { upsert: true, new: true } // Insert if not found
    );

    return res.status(200).json({
      message: 'Tokens saved successfully!',
      token: tokenDoc,
    });
  } catch (err) {
    console.error('Error handling OAuth callback:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};


/**
 * Refresh the Calendly access token using the refresh token.
 */
exports.refreshCalendlyToken = async () => {
  try {
    // Retrieve the latest token from the database
    const tokenRecord = await Token.findOne().sort({ created_at: -1 });
    if (!tokenRecord || !tokenRecord.refresh_token) {
      throw new Error('No refresh token found in the database');
    }

    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: tokenRecord.refresh_token,
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${process.env.CALENDLY_CLIENT_ID}:${process.env.CALENDLY_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body,
    };

    const response = await fetch('https://auth.calendly.com/oauth/token', options);
    const data = await response.json();

    if (!response.ok) {
      console.error('Error refreshing token:', data);
      return;
    }

    const { access_token, refresh_token, token_type, expires_in, created_at } = data;

    // Update the token in the database
    await Token.findOneAndUpdate(
      { owner: tokenRecord.owner }, // Update the record for the same owner
      { access_token, refresh_token, token_type, expires_in, created_at }, // Update fields
      { upsert: true, new: true } // Insert if not found
    );

    console.log('Token refreshed successfully at:', new Date().toISOString());
  } catch (err) {
    console.error('Error refreshing Calendly token:', err.message);
  }
};
