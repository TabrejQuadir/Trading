const express = require('express');
const router = express.Router();
const { registerSubAdmin, registerSuperAdmin, loginAdmin, getAllSubAdmins, getUsersBySubAdmin, getAllUsers, deleteSubAdmin } = require('../controllers/adminController');
const { adminAuth } = require('../middilware/adminAuth');

// Register Admin Route
router.post('/registerSuperAdmin', registerSuperAdmin);

// Login Admin Route
router.post('/login', loginAdmin);

// Register Sub-Admin Route
router.post('/registerSubAdmin', adminAuth, registerSubAdmin);

// Route to get all sub-admins - only accessible by super admin
router.get('/subadmins', adminAuth, getAllSubAdmins);

// Route to delete a specific sub-admin by ID - only accessible by super admin
router.delete('/subadmins/:id', adminAuth, deleteSubAdminController);

// Route for sub-admin to get users registered through their invitation code
router.get('/users', adminAuth, getUsersBySubAdmin);  // Only accessible by sub-admin

// Route for super-admin to get all users
router.get('/all-users', adminAuth, getAllUsers);  // Only accessible by super-admin




module.exports = router;