const express = require('express');
const { handleOAuthCallback } = require('../controllers/tokenController'); // Adjust the path

const router = express.Router();

router.post('/calendly', async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is missing' });
  }

  // Pass the code to the controller
  await handleOAuthCallback(req, res);
});

module.exports = router;
