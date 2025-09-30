const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const InvestmentPlan = require('./models/InvestmentPlan');
const Investment = require('./models/Investment');
const PlanCategory = require('./models/PlanCategory');

const createTestInvestment = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find test user
    const user = await User.findOne({ email: 'user@test.com' });
    if (!user) {
      console.log('Test user not found');
      return;
    }

    // Find a category
    const category = await PlanCategory.findOne();
    if (!category) {
      console.log('No category found');
      return;
    }

    // Create a test plan with 1 minute duration for testing
    const testPlan = new InvestmentPlan({
      title: 'Test Plan - 1 Minute',
      description: 'Test investment plan that matures in 1 minute',
      category: category._id,
      amount: 1000,
      expectedReturn: 100,
      duration: { value: 1, unit: 'days' }, // Will be overridden below
      isActive: true
    });
    await testPlan.save();

    // Create investment that matures in 1 minute
    const maturityDate = new Date();
    maturityDate.setMinutes(maturityDate.getMinutes() + 1); // 1 minute from now

    const investment = new Investment({
      user: user._id,
      plan: testPlan._id,
      investedAmount: 1000,
      expectedReturn: 100,
      maturityDate
    });
    await investment.save();

    console.log('Test investment created:');
    console.log(`Investment ID: ${investment._id}`);
    console.log(`User: ${user.email}`);
    console.log(`Amount: ₹${investment.investedAmount}`);
    console.log(`Expected Return: ₹${investment.expectedReturn}`);
    console.log(`Maturity Date: ${maturityDate.toISOString()}`);
    console.log(`Current Time: ${new Date().toISOString()}`);
    console.log('Investment will mature in 1 minute. Watch the cron job logs!');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

createTestInvestment();