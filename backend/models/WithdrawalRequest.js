const mongoose = require("mongoose");

const withdrawalRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: {
    type: String,
    enum: ["INR", "PKR", "RUB"],
    required: true,
  }, // Supported currencies
  bankDetails: {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    branchCode: { type: String, required: true },
  },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  requestedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date },
});

const WithdrawalRequest = mongoose.model(
  "WithdrawalRequest",
  withdrawalRequestSchema
);

module.exports = WithdrawalRequest;
