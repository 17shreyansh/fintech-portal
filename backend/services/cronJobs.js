const cron = require('node-cron');
const Investment = require('../models/Investment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// Run daily at midnight in production, every minute in development
const cronExpression = process.env.NODE_ENV === 'production' ? '0 0 * * *' : '* * * * *';
const processMaturedInvestments = cron.schedule(cronExpression, async () => {
  try {
    const now = new Date();
    console.log(`[${now.toISOString()}] Checking for matured investments...`);
    
    const maturedInvestments = await Investment.find({
      status: 'active',
      maturityDate: { $lte: now }
    }).populate('user plan');

    if (maturedInvestments.length === 0) {
      console.log('No matured investments found.');
      return;
    }

    console.log(`Found ${maturedInvestments.length} matured investments to process`);

    for (const investment of maturedInvestments) {
      try {
        // Update investment status
        investment.status = 'completed';
        investment.completedAt = new Date();
        investment.actualMaturityAmount = investment.totalMaturityAmount;
        await investment.save();

        // Credit user wallet with total maturity amount
        const user = await User.findById(investment.user._id);
        const profitAmount = investment.totalMaturityAmount - investment.investedAmount;
        
        user.walletBalance += investment.totalMaturityAmount;
        await user.save();

        // Create return transaction for the full maturity amount
        await new Transaction({
          user: investment.user._id,
          type: 'return',
          amount: investment.totalMaturityAmount,
          status: 'approved',
          description: `Investment matured: ${investment.plan.title} - Principal: ₹${investment.investedAmount.toLocaleString()} + Profit: ₹${profitAmount.toLocaleString()}`
        }).save();

        console.log(`✅ Investment ${investment._id} matured successfully:`);
        console.log(`   User: ${investment.user.email}`);
        console.log(`   Plan: ${investment.plan.title}`);
        console.log(`   Principal: ₹${investment.investedAmount.toLocaleString()}`);
        console.log(`   Profit: ₹${profitAmount.toLocaleString()}`);
        console.log(`   Total Credited: ₹${investment.totalMaturityAmount.toLocaleString()}`);
        console.log(`   New Wallet Balance: ₹${user.walletBalance.toLocaleString()}`);
        
      } catch (error) {
        console.error(`❌ Error processing investment ${investment._id}:`, error);
      }
    }

    console.log(`🎉 Successfully processed ${maturedInvestments.length} matured investments`);
  } catch (error) {
    console.error('❌ Error in cron job:', error);
  }
}, {
  scheduled: false
});

module.exports = {
  startCronJobs: () => {
    processMaturedInvestments.start();
    console.log('Cron jobs started');
  },
  stopCronJobs: () => {
    processMaturedInvestments.stop();
    console.log('Cron jobs stopped');
  }
};