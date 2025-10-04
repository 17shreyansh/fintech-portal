const express = require('express');
const multer = require('multer');
const path = require('path');
const { adminAuth } = require('../middleware/auth');
const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');
const SupportTicket = require('../models/SupportTicket');
const QRSettings = require('../models/QRSettings');
const router = express.Router();

// Multer configuration for QR code upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

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

// Update user bank details (Admin support)
router.put('/users/:id/bank-details', adminAuth, async (req, res) => {
  try {
    const { bankDetails } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { bankDetails },
      { new: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ message: 'Bank details updated successfully', user });
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

// Get QR settings
router.get('/qr-settings', adminAuth, async (req, res) => {
  try {
    const qrSettings = await QRSettings.findOne({ isActive: true }).populate('updatedBy', 'name');
    res.json(qrSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update QR settings
router.post('/qr-settings', adminAuth, upload.single('qrCode'), async (req, res) => {
  try {
    const { upiId } = req.body;
    
    if (!upiId) {
      return res.status(400).json({ message: 'UPI ID is required' });
    }
    
    // Deactivate existing QR settings
    await QRSettings.updateMany({}, { isActive: false });
    
    const qrData = {
      upiId,
      updatedBy: req.user.id,
      isActive: true
    };
    
    if (req.file) {
      qrData.qrCodeImage = req.file.filename;
    } else {
      // If no new file, keep the existing one
      const existing = await QRSettings.findOne().sort({ createdAt: -1 });
      if (existing) {
        qrData.qrCodeImage = existing.qrCodeImage;
      } else {
        return res.status(400).json({ message: 'QR code image is required' });
      }
    }
    
    const newQRSettings = new QRSettings(qrData);
    await newQRSettings.save();
    
    res.json({ message: 'QR settings updated successfully', qrSettings: newQRSettings });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;