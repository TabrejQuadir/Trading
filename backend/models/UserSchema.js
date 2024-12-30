// models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0 },
  reputationPoints: { type: Number, default: 100 },
  vipLevel: { type: String, default: 'Bronze' },
  country: { type: String, required: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null }, // Reference to sub-admin
  isGonnaWin: { type: Boolean, default: false }, 
  isBalanceFrozen: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
