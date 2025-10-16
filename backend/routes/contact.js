const express = require('express');
const ContactSettings = require('../models/ContactSettings');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Get contact settings (public)
router.get('/', async (req, res) => {
  try {
    let contactSettings = await ContactSettings.findOne();
    
    if (!contactSettings) {
      // Create default settings if none exist
      contactSettings = new ContactSettings();
      await contactSettings.save();
    }
    
    res.json(contactSettings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update contact settings (admin only)
router.put('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    const { email, phone, address, workingHours, workingHoursDescription } = req.body;

    let contactSettings = await ContactSettings.findOne();
    
    if (!contactSettings) {
      contactSettings = new ContactSettings();
    }

    contactSettings.email = email || contactSettings.email;
    contactSettings.phone = phone || contactSettings.phone;
    contactSettings.address = address || contactSettings.address;
    contactSettings.workingHours = workingHours || contactSettings.workingHours;
    contactSettings.workingHoursDescription = workingHoursDescription || contactSettings.workingHoursDescription;

    await contactSettings.save();

    res.json({ message: 'Contact settings updated successfully', contactSettings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;