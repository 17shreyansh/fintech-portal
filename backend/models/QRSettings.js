const mongoose = require('mongoose');

const qrSettingsSchema = new mongoose.Schema({
  qrCodeImage: { type: String, required: true },
  upiId: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('QRSettings', qrSettingsSchema);