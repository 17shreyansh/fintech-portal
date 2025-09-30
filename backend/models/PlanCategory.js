const mongoose = require('mongoose');

const planCategorySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['Silver', 'Gold', 'Diamond', 'AI Robot']
  },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('PlanCategory', planCategorySchema);