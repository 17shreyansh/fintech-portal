const express = require('express');
const multer = require('multer');
const path = require('path');
const { auth, adminAuth } = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const QRSettings = require('../models/QRSettings');
const router = express.Router();

// Multer config for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Get QR settings for deposit
router.get('/qr-settings', auth, async (req, res) => {
  try {
    const qrSettings = await QRSettings.findOne({ isActive: true });
    if (!qrSettings) {
      return res.status(404).json({ message: 'QR settings not found' });
    }
    res.json(qrSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Request deposit
router.post('/deposit', auth, upload.single('proof'), async (req, res) => {
  try {
    const { amount } = req.body;
    const transaction = new Transaction({
      user: req.user.id,
      type: 'deposit',
      amount: parseFloat(amount),
      proof: req.file ? req.file.filename : null
    });
    await transaction.save();
    res.status(201).json({ message: 'Deposit request submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Request withdrawal
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    const transaction = new Transaction({
      user: req.user.id,
      type: 'withdrawal',
      amount: parseFloat(amount)
    });
    await transaction.save();
    
    res.status(201).json({ message: 'Withdrawal request submitted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Get transaction history
router.get('/history', auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('plan');
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all transactions
router.get('/all', adminAuth, async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate('user', 'name email bankDetails')
      .populate('plan')
      .sort({ createdAt: -1 });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Approve/Reject transaction
router.put('/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const transaction = await Transaction.findById(req.params.id);
    
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    transaction.status = status;
    await transaction.save();

    // If deposit approved, credit wallet
    if (status === 'approved' && transaction.type === 'deposit') {
      const user = await User.findById(transaction.user);
      user.walletBalance += transaction.amount;
      await user.save();
    }

    // If withdrawal approved, deduct from wallet
    if (status === 'approved' && transaction.type === 'withdrawal') {
      const user = await User.findById(transaction.user);
      user.walletBalance -= transaction.amount;
      await user.save();
    }

    res.json({ message: 'Transaction status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;