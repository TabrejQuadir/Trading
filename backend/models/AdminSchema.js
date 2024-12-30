const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['superadmin', 'subadmin'], required: true },
    invitationCode: { type: String, unique: true }, // Invitation code for superadmin
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, // Superadmin who created subadmin
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Admin', AdminSchema);
