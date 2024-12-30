const mongoose = require('mongoose');

const InvitationCodeSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    subAdminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InvitationCode', InvitationCodeSchema);