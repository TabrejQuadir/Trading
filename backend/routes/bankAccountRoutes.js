const express = require('express');
const router = express.Router();
const { 
    getUserBankAccounts,
    createBankAccount,
    updateBankAccount,
    deleteBankAccount,
    setDefaultBankAccount
} = require('../controllers/bankAccountController');
const authMiddleware = require('../middilware/authMiddleware');

// Get all bank accounts for a user
router.get('/', authMiddleware, getUserBankAccounts);

// Create a new bank account
router.post('/', authMiddleware, createBankAccount);

// Update a bank account
router.put('/:id', authMiddleware, updateBankAccount);

// Delete a bank account
router.delete('/:id', authMiddleware, deleteBankAccount);

// Set a bank account as default
router.put('/:id/set-default', authMiddleware, setDefaultBankAccount);

module.exports = router;
