// routes/authRoutes.js

const express = require('express');
const { registerUser, loginUser, logoutUser, getProfile, addBalance, deductBalance, updateBalanceFrozen, addReputation, deductReputation, isGonnaWin } = require('../controllers/authController');
const router = express.Router();
const authMiddilware = require('../middilware/authMiddleware');
const {adminAuth} = require('../middilware/adminAuth');

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Logout route
router.post('/logout', logoutUser);

// Route to get the user's profile data
router.get('/profile', authMiddilware , getProfile);

// Route to update isGonnaWin
router.post('/isGonnaWin', adminAuth, isGonnaWin);

// Add balance route
router.post('/add-balance', adminAuth, addBalance);

// Deduct balance route
router.post('/deduct-balance', adminAuth, deductBalance);

// Update balance frozen route
router.post('/update-balance-frozen', adminAuth, updateBalanceFrozen);

// Add ReputationPoints route
router.post('/add-reputation', adminAuth, addReputation);

// Deduct ReputationPoints route
router.post('/deduct-reputation', adminAuth, deductReputation);

module.exports = router;
