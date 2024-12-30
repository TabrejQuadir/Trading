const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  direction: {
    type: String,
    enum: ['Buy Up', 'Buy Down'], // Valid values for the direction
    required: true,
  },
  investment: {
    type: Number,
    required: true,
    min: 0,
  },
  duration: {
    type: String, // Duration is stored as a string, but you may choose to convert it to a number.
    required: true,
  },
  profitPercentage: {
    type: Number,
    required: true,
    min: 0,
  },
  orderPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['open', 'closeout'], // Order can either be 'open' or 'closeout'
    default: 'open', // Default is open
  },
  closeOutPrice: {
    type: Number, // Closeout price when the order is finished
  },
  isWin: { type: Boolean, default: false }, // Indicates if the order was a win
  isLoss: { type: Boolean, default: false }, // Indicates if the order was a loss

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
