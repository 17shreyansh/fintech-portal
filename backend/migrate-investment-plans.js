const mongoose = require('mongoose');
require('dotenv').config();

const migratePlans = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fintech-app');
  console.log('📡 Connected to MongoDB');
  try {
    console.log('🚀 Starting migration from expectedReturn to totalMaturityAmount...');
    
    // Update InvestmentPlan collection
    const planResult = await mongoose.connection.db.collection('investmentplans').updateMany(
      { expectedReturn: { $exists: true } },
      [
        {
          $set: {
            totalMaturityAmount: { $add: ['$amount', '$expectedReturn'] }
          }
        },
        {
          $unset: 'expectedReturn'
        }
      ]
    );
    
    console.log(`✅ Updated ${planResult.modifiedCount} investment plans`);
    
    // Update Investment collection
    const investmentResult = await mongoose.connection.db.collection('investments').updateMany(
      { expectedReturn: { $exists: true } },
      [
        {
          $set: {
            totalMaturityAmount: { $add: ['$investedAmount', '$expectedReturn'] },
            actualMaturityAmount: '$actualReturn'
          }
        },
        {
          $unset: ['expectedReturn', 'actualReturn']
        }
      ]
    );
    
    console.log(`✅ Updated ${investmentResult.modifiedCount} investments`);
    
    console.log('🎉 Migration completed successfully!');
    await mongoose.disconnect();
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

migratePlans();