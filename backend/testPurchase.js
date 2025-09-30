const mongoose = require('mongoose');
const axios = require('axios');
require('dotenv').config();

const testInvestmentPurchase = async () => {
  try {
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'user@test.com',
      password: 'user123'
    });

    const token = loginResponse.data.token;
    console.log('✅ Login successful');

    // Get user profile to check wallet balance
    const profileResponse = await axios.get('http://localhost:5000/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`💰 Current wallet balance: ₹${profileResponse.data.walletBalance.toLocaleString()}`);

    // Get available plans
    const plansResponse = await axios.get('http://localhost:5000/api/plans');
    const plans = plansResponse.data.plans;
    
    if (plans.length === 0) {
      console.log('❌ No plans available');
      return;
    }

    const firstPlan = plans[0];
    console.log(`📋 Attempting to buy plan: ${firstPlan.title}`);
    console.log(`💵 Plan cost: ₹${firstPlan.amount.toLocaleString()}`);
    console.log(`📈 Expected return: ₹${firstPlan.expectedReturn.toLocaleString()}`);

    // Attempt to buy the plan
    const purchaseResponse = await axios.post(
      `http://localhost:5000/api/plans/buy/${firstPlan._id}`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('🎉 Investment purchase successful!');
    console.log('Response:', purchaseResponse.data);

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
};

testInvestmentPurchase();