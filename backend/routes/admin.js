const express = require('express');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const SupportTicket = require('../models/SupportTicket');
const router = express.Router();

// Admin dashboard stats
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalInvestments = await Investment.countDocuments();
    const pendingDeposits = await Transaction.countDocuments({ type: 'deposit', status: 'pending' });
    const pendingWithdrawals = await Transaction.countDocuments({ type: 'withdrawal', status: 'pending' });
    const openTickets = await SupportTicket.countDocuments({ status: 'open' });
    
    const totalInvestedAmount = await Investment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalUsers,
      totalInvestments,
      pendingDeposits,
      pendingWithdrawals,
      openTickets,
      totalInvestedAmount: totalInvestedAmount[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle user status
router.put('/users/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: 'User status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user details with investments
router.get('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    const investments = await Investment.find({ user: req.params.id }).populate('plan');
    const transactions = await Transaction.find({ user: req.params.id }).sort({ createdAt: -1 });
    
    res.json({ user, investments, transactions });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;