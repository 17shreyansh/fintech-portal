const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const SupportTicket = require('../models/SupportTicket');
const router = express.Router();

// User: Create support ticket
router.post('/', auth, async (req, res) => {
  try {
    const { subject, description } = req.body;
    const ticket = new SupportTicket({
      user: req.user.id,
      subject,
      description
    });
    await ticket.save();
    res.status(201).json({ message: 'Support ticket created' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// User: Get user's tickets
router.get('/my-tickets', auth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Get all tickets
router.get('/all', adminAuth, async (req, res) => {
  try {
    const tickets = await SupportTicket.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update ticket status
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    const ticket = await SupportTicket.findByIdAndUpdate(
      req.params.id,
      { status, adminResponse },
      { new: true }
    );
    res.json({ message: 'Ticket updated', ticket });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;