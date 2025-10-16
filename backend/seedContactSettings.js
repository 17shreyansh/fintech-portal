const mongoose = require('mongoose');
const ContactSettings = require('./models/ContactSettings');
require('dotenv').config();

const seedContactSettings = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if contact settings already exist
    const existingSettings = await ContactSettings.findOne();
    
    if (!existingSettings) {
      const defaultSettings = new ContactSettings({
        email: 'support@adhanigold.com',
        phone: '+91 98765 43210',
        address: 'Mumbai, Maharashtra, India',
        workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
        workingHoursDescription: 'Saturday: 10:00 AM - 4:00 PM'
      });

      await defaultSettings.save();
      console.log('Default contact settings created successfully');
    } else {
      console.log('Contact settings already exist');
    }

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding contact settings:', error);
    process.exit(1);
  }
};

seedContactSettings();