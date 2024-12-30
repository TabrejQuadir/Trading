const express = require('express');
const router = express.Router();
const authMiddleware = require('../middilware/authMiddleware');
const {adminAuth} = require('../middilware/adminAuth');
const {
  createWithdrawalRequest,
  getUserWithdrawalRequests,
  getWithdrawalRequestsBySubAdmin,
  getAllWithdrawalRequests,
  updateWithdrawalRequestsBySubAdmin
} = require('../controllers/withdrawalController');

// Create a withdrawal request
router.post('/', authMiddleware, createWithdrawalRequest);

// Get user's withdrawal requests
router.get('/', authMiddleware, getUserWithdrawalRequests);

// Fetch withdrawal requests for users referred by the sub-admin
router.get('/subadmin/:userId', getWithdrawalRequestsBySubAdmin);

// Route for super admin to get all withdrawal requests
router.get('/superAdmin/all', getAllWithdrawalRequests);

// Update withdrawal requests for users referred by the sub-admin
router.post('/subadmin/:userId/update-status', adminAuth, updateWithdrawalRequestsBySubAdmin);



module.exports = router;
