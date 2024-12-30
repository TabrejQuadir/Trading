const BankAccount = require("../models/BankAccount");

// Get all bank accounts for a user
const getUserBankAccounts = async (req, res) => {
  try {
    const accounts = await BankAccount.find({ userId: req.user._id });
    res.json({ accounts });
  } catch (error) {
    console.error("Error fetching bank accounts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createBankAccount = async (req, res) => {
  const userId = req.user._id;
  console.log("userId:", userId);

  if (!userId) {
    return res.status(400).json({ message: "userId is required." });
  }

  // Log the entire request body
  console.log("Request body:", req.body);

  const { bankName, accountNumber, accountHolder, branchCode } = req.body;

  if (!bankName || !accountNumber || !accountHolder || !branchCode) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingAccounts = await BankAccount.find({ userId: userId });
    if (existingAccounts.length >= 2) {
      return res
        .status(400)
        .json({ message: "Maximum limit of 2 bank accounts reached." });
    }

    const isDefault = existingAccounts.length === 0;

    const bankAccount = new BankAccount({
      userId: userId,
      bankName,
      accountNumber,
      accountHolder,
      branchCode,
      isDefault,
    });

    await bankAccount.save();

    res.status(201).json({
      message: "Bank account created successfully.",
      account: bankAccount,
    });
  } catch (error) {
    console.error("Error creating bank account:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a bank account
const updateBankAccount = async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    const { bankName, accountNumber, accountHolder, branchCode } = req.body;

    account.bankName = bankName;
    account.accountNumber = accountNumber;
    account.accountHolder = accountHolder;
    account.branchCode = branchCode;

    await account.save();
    res.json({ message: "Bank account updated successfully", account });
  } catch (error) {
    console.error("Error updating bank account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a bank account
const deleteBankAccount = async (req, res) => {
  try {
    const account = await BankAccount.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!account) {
      return res.status(404).json({ message: "Bank account not found" });
    }

    const wasDefault = account.isDefault;
    await BankAccount.deleteOne({ _id: req.params.id });

    // If the deleted account was default and there's another account, make it default
    if (wasDefault) {
      const remainingAccount = await BankAccount.findOne({
        userId: req.user.userId,
      });
      if (remainingAccount) {
        remainingAccount.isDefault = true;
        await remainingAccount.save();
      }
    }

    res.json({ message: "Bank account deleted successfully" });
  } catch (error) {
    console.error("Error deleting bank account:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Set a bank account as default
const setDefaultBankAccount = async (req, res) => {
  const { id } = req.params;
  try {
    // Step 1: Find the current default account
    const currentDefault = await BankAccount.findOne({ isDefault: true });

    // Step 2: Unset the current default account if it exists
    if (currentDefault) {
      currentDefault.isDefault = false;
      await currentDefault.save();
    }

    // Step 3: Set the new default account
    const account = await BankAccount.findById(id);
    if (!account) {
      return res.status(404).json({ message: 'Bank account not found' });
    }

    account.isDefault = true;
    await account.save();

    res.status(200).json({ message: 'Default account set successfully', account });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getUserBankAccounts,
  createBankAccount,
  updateBankAccount,
  deleteBankAccount,
  setDefaultBankAccount,
};
