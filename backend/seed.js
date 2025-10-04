const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const PlanCategory = require('./models/PlanCategory');
const InvestmentPlan = require('./models/InvestmentPlan');
const QRSettings = require('./models/QRSettings');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await PlanCategory.deleteMany({});
    await InvestmentPlan.deleteMany({});

    // Create admin user
    const admin = new User({
      name: 'Admin User',
      email: 'admin@fintech.com',
      password: 'admin123',
      role: 'admin',
      walletBalance: 0,
      bankDetails: {
        accountHolderName: 'Admin User',
        accountNumber: '1234567890',
        ifscCode: 'HDFC0000001',
        bankName: 'HDFC Bank',
        branchName: 'Main Branch',
        upiId: 'admin@paytm'
      }
    });
    await admin.save();

    // Create test user
    const user = new User({
      name: 'Test User',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      walletBalance: 50000,
      bankDetails: {
        accountHolderName: 'Test User',
        accountNumber: '9876543210',
        ifscCode: 'ICICI0000001',
        bankName: 'ICICI Bank',
        branchName: 'Test Branch',
        upiId: 'testuser@phonepe'
      }
    });
    await user.save();

    // Create fixed plan categories
    const categories = [
      { name: 'Silver', description: 'Entry-level investment plans with steady returns', icon: '🥈' },
      { name: 'Gold', description: 'Premium investment plans with higher returns', icon: '🥇' },
      { name: 'Diamond', description: 'Elite investment plans for serious investors', icon: '💎' },
      { name: 'AI Robot', description: 'Automated AI-driven investment strategies', icon: '🤖' }
    ];

    const createdCategories = await PlanCategory.insertMany(categories);

    // Create investment plans with expected return amounts
    const plans = [
      // Silver Plans
      {
        title: 'Silver Starter',
        description: 'Perfect for beginners starting their investment journey',
        category: createdCategories[0]._id,
        amount: 5000,
        expectedReturn: 600,
        duration: { value: 1, unit: 'months' }
      },
      {
        title: 'Silver Growth',
        description: 'Steady growth with moderate risk',
        category: createdCategories[0]._id,
        amount: 15000,
        expectedReturn: 2700,
        duration: { value: 2, unit: 'months' }
      },
      {
        title: 'Silver Plus',
        description: 'Enhanced silver plan with better returns',
        category: createdCategories[0]._id,
        amount: 25000,
        expectedReturn: 5500,
        duration: { value: 3, unit: 'months' }
      },
      // Gold Plans
      {
        title: 'Gold Standard',
        description: 'Premium investment with excellent returns',
        category: createdCategories[1]._id,
        amount: 50000,
        expectedReturn: 14000,
        duration: { value: 4, unit: 'months' }
      },
      {
        title: 'Gold Elite',
        description: 'High-value gold investment plan',
        category: createdCategories[1]._id,
        amount: 100000,
        expectedReturn: 35000,
        duration: { value: 6, unit: 'months' }
      },
      {
        title: 'Gold Premium',
        description: 'Top-tier gold investment opportunity',
        category: createdCategories[1]._id,
        amount: 200000,
        expectedReturn: 84000,
        duration: { value: 8, unit: 'months' }
      },
      // Diamond Plans
      {
        title: 'Diamond Exclusive',
        description: 'Exclusive diamond plan for elite investors',
        category: createdCategories[2]._id,
        amount: 500000,
        expectedReturn: 275000,
        duration: { value: 1, unit: 'years' }
      },
      {
        title: 'Diamond Platinum',
        description: 'Ultra-premium diamond investment',
        category: createdCategories[2]._id,
        amount: 1000000,
        expectedReturn: 680000,
        duration: { value: 18, unit: 'months' }
      },
      // AI Robot Plans
      {
        title: 'AI Smart Trader',
        description: 'AI-powered automated trading system',
        category: createdCategories[3]._id,
        amount: 75000,
        expectedReturn: 33750,
        duration: { value: 6, unit: 'months' }
      },
      {
        title: 'AI Pro Algorithm',
        description: 'Advanced AI investment algorithm',
        category: createdCategories[3]._id,
        amount: 250000,
        expectedReturn: 150000,
        duration: { value: 1, unit: 'years' }
      },
      {
        title: 'AI Master Bot',
        description: 'Ultimate AI-driven investment solution',
        category: createdCategories[3]._id,
        amount: 750000,
        expectedReturn: 637500,
        duration: { value: 2, unit: 'years' }
      }
    ];

    await InvestmentPlan.insertMany(plans);

    // Create default QR settings
    const qrSettings = new QRSettings({
      qrCodeImage: 'default-qr.png', // Admin should upload actual QR code
      upiId: 'business@paytm',
      updatedBy: admin._id,
      isActive: true
    });
    await qrSettings.save();

    console.log('Seed data created successfully!');
    console.log('Admin credentials: admin@fintech.com / admin123');
    console.log('User credentials: user@test.com / user123');
    console.log('Note: Please upload QR code image in admin panel');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();