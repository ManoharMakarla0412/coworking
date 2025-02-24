const express = require('express');
const paymentController = require('../controllers/phonepeContrroller');

const router = express.Router();

// Create Order Route
router.post('/create-order', paymentController.createOrder);

// Payment Status Route
router.post('/status', paymentController.checkStatus);

module.exports = router;