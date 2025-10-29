const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'InvestmentPlan', required: true },
  investedAmount: { type: Number, required: true },
  totalMaturityAmount: { type: Number, required: true },
  actualMaturityAmount: { type: Number, default: 0 },
  maturityDate: { type: Date, required: true },
  status: { type: String, enum: ['active', 'completed', 'cancelled'], default: 'active' },
  autoReinvest: { type: Boolean, default: false },
  completedAt: { type: Date },
  profitLoss: { type: Number, default: 0 }
}, { timestamps: true });

// Virtual for profit amount
investmentSchema.virtual('profitAmount').get(function() {
  return this.totalMaturityAmount - this.investedAmount;
});

// Virtual for days remaining
investmentSchema.virtual('daysRemaining').get(function() {
  if (this.status !== 'active') return 0;
  const now = new Date();
  const diffTime = this.maturityDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
});

// Virtual for progress percentage
investmentSchema.virtual('progressPercent').get(function() {
  if (this.status !== 'active') return 100;
  const now = new Date();
  const startTime = this.createdAt;
  const totalTime = this.maturityDate - startTime;
  const elapsedTime = now - startTime;
  return Math.min(100, Math.max(0, (elapsedTime / totalTime) * 100));
});

investmentSchema.set('toJSON', { virtuals: true });
investmentSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Investment', investmentSchema);