const express = require('express');
const router = express.Router();
const { signup, login, forgotPassword, getCurrentUser , getAllUsers} = require('../controllers/userController');

// Route to signup a new user
router.post('/signup', signup);

// Route to login user
router.post('/login', login);

// Route to request password reset link
router.post('/forgot-password', forgotPassword);

// Route to get the current logged-in user
router.get("/me", getCurrentUser);

// Route to get all the users
router.get("/allusers", getAllUsers);
module.exports = router;
