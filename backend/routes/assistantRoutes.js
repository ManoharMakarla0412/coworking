const express = require('express');
const router = express.Router();
const { createAssistant, getAssistant, updateAssistant } = require('../controllers/assistantController');
const { authenticateToken } = require('../utils/auth');

// Route to create an assistant
router.post('/create', authenticateToken, createAssistant);

// Route to get the assistant for the user
router.get('/get', getAssistant);

// Route to update the assistant for the user
router.put('/update', updateAssistant);

module.exports = router;
