const express = require('express');
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get user dashboard data
router.get('/dashboard', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const investments = await Investment.find({ user: req.user.id }).populate('plan');
    const transactions = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 }).limit(10);
    
    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
    const activeInvestments = investments.filter(inv => inv.status === 'active').length;
    
    res.json({
      walletBalance: user.walletBalance,
      totalInvested,
      activeInvestments,
      investments,
      recentTransactions: transactions
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user investments
router.get('/investments', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id })
      .populate('plan')
      .sort({ createdAt: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});



// Change password
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    user.password = newPassword;
    await user.save();
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;