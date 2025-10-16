const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  walletBalance: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  bankDetails: {
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    bankName: { type: String, required: true },
    upiId: { type: String, required: true }
  },
  kyc: {
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    documents: [String]
  },
  preferences: {
    autoReinvest: { type: Boolean, default: false },
    riskTolerance: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false }
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, { timestamps: true });

// Virtual to mask account number for display
userSchema.virtual('maskedAccountNumber').get(function() {
  if (!this.bankDetails?.accountNumber) return '';
  const acc = this.bankDetails.accountNumber;
  return acc.length > 4 ? 'XXXX' + acc.slice(-4) : acc;
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);