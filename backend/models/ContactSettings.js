const mongoose = require('mongoose');

const contactSettingsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    default: 'support@adhanigold.com'
  },
  phone: {
    type: String,
    required: true,
    default: '+91 98765 43210'
  },
  address: {
    type: String,
    required: true,
    default: 'Mumbai, Maharashtra, India'
  },
  workingHours: {
    type: String,
    required: true,
    default: 'Mon - Fri: 9:00 AM - 6:00 PM'
  },
  workingHoursDescription: {
    type: String,
    default: 'Saturday: 10:00 AM - 4:00 PM'
  },
  commonIssues: {
    type: [String],
    default: [
      'Deposit not reflecting',
      'Withdrawal delays',
      'Investment questions',
      'Account security'
    ]
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactSettings', contactSettingsSchema);