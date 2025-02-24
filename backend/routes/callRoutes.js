const express = require('express');
const { createCall, getCallLogs } = require('../controllers/callController');

const router = express.Router();

// Route to create a call
router.post('/create', createCall);
router.get('/logs', getCallLogs);

module.exports = router;
