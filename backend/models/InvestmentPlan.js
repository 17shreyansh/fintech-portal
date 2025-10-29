const mongoose = require('mongoose');

const investmentPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'PlanCategory', required: true },
  amount: { type: Number, required: true },
  totalMaturityAmount: { type: Number, required: true },
  duration: {
    value: { type: Number, required: true },
    unit: { type: String, enum: ['days', 'months', 'years'], required: true }
  },
  isActive: { type: Boolean, default: true },
  oneTimeOnly: { type: Boolean, default: false }
}, { timestamps: true });

// Virtual for duration in days
investmentPlanSchema.virtual('durationInDays').get(function() {
  switch(this.duration.unit) {
    case 'days': return this.duration.value;
    case 'months': return this.duration.value * 30;
    case 'years': return this.duration.value * 365;
    default: return this.duration.value;
  }
});

// Virtual for profit amount
investmentPlanSchema.virtual('profitAmount').get(function() {
  return this.totalMaturityAmount - this.amount;
});

// Virtual for return percentage
investmentPlanSchema.virtual('returnPercent').get(function() {
  const profit = this.totalMaturityAmount - this.amount;
  return ((profit / this.amount) * 100).toFixed(2);
});

investmentPlanSchema.set('toJSON', { virtuals: true });
investmentPlanSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('InvestmentPlan', investmentPlanSchema);