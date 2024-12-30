const mongoose = require('mongoose');

const currencySchema = new mongoose.Schema({
    symbolCode: { type: String, required: true, unique: true },
    symbolDisplayName: { type: String, required: true },
    symbolIcon: { type: String, required: true },
    price: { type: Number, required: true },
    updown: { type: Number, required: true },
    pointMin: { type: Number, required: true },
    pointMax: { type: Number, required: true },
    manualUpdateTimestamp: { type: Date, default: null },
});

// Export the model
const Currency = mongoose.model('Currency', currencySchema);
module.exports = Currency;
