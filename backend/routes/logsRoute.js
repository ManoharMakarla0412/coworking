const express = require('express');
const { getAllLogs } = require('../controllers/logsController');
const router = express.Router();

// Route for retrieving logs
router.get('/logs', getAllLogs);

module.exports = router;
