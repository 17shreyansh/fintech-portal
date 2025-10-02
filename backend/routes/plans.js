const express = require('express');
const { auth, adminAuth } = require('../middleware/auth');
const PlanCategory = require('../models/PlanCategory');
const InvestmentPlan = require('../models/InvestmentPlan');
const Investment = require('../models/Investment');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const router = express.Router();

// Get all categories and plans
router.get('/', auth, async (req, res) => {
  try {
    const categories = await PlanCategory.find({ isActive: true });
    const plans = await InvestmentPlan.find({ isActive: true }).populate('category');
    
    // Check which plans user has active investments in
    const activeInvestments = await Investment.find({
      user: req.user.id,
      status: 'active'
    }).select('plan');
    
    // Check which plans user has ever invested in (for one-time-only plans)
    const allUserInvestments = await Investment.find({
      user: req.user.id
    }).select('plan');
    
    const activePlanIds = activeInvestments.map(inv => inv.plan.toString());
    const allInvestedPlanIds = allUserInvestments.map(inv => inv.plan.toString());
    
    // Add locked status to plans
    const plansWithLockStatus = plans.map(plan => {
      const hasActiveInvestment = activePlanIds.includes(plan._id.toString());
      const hasEverInvested = allInvestedPlanIds.includes(plan._id.toString());
      const isLockedForOneTime = plan.oneTimeOnly && hasEverInvested;
      
      return {
        ...plan.toObject(),
        isLocked: hasActiveInvestment || isLockedForOneTime
      };
    });
    
    res.json({ categories, plans: plansWithLockStatus });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Buy investment plan
router.post('/buy/:planId', auth, async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.planId).populate('category');
    if (!plan) {
      return res.status(404).json({ message: 'Investment plan not found' });
    }

    if (!plan.isActive) {
      return res.status(400).json({ message: 'This investment plan is currently inactive' });
    }

    // Check if user already has an active investment in this plan
    const existingActiveInvestment = await Investment.findOne({
      user: req.user.id,
      plan: req.params.planId,
      status: 'active'
    });

    if (existingActiveInvestment) {
      return res.status(400).json({ 
        message: 'You already have an active investment in this plan. Please wait for it to mature before investing again.' 
      });
    }

    // Check if plan is one-time-only and user has ever invested
    if (plan.oneTimeOnly) {
      const hasEverInvested = await Investment.findOne({
        user: req.user.id,
        plan: req.params.planId
      });

      if (hasEverInvested) {
        return res.status(400).json({ 
          message: 'This is a one-time investment plan. You have already invested in this plan and cannot invest again.' 
        });
      }
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check wallet balance
    if (user.walletBalance < plan.amount) {
      return res.status(400).json({ 
        message: `Insufficient wallet balance. Required: ₹${plan.amount.toLocaleString()}, Available: ₹${user.walletBalance.toLocaleString()}` 
      });
    }

    // Calculate maturity date based on plan duration
    const maturityDate = new Date();
    switch(plan.duration.unit) {
      case 'days':
        maturityDate.setDate(maturityDate.getDate() + plan.duration.value);
        break;
      case 'months':
        maturityDate.setMonth(maturityDate.getMonth() + plan.duration.value);
        break;
      case 'years':
        maturityDate.setFullYear(maturityDate.getFullYear() + plan.duration.value);
        break;
      default:
        maturityDate.setDate(maturityDate.getDate() + plan.duration.value);
    }

    // Deduct amount from wallet
    user.walletBalance -= plan.amount;
    await user.save();

    // Create investment record
    const investment = new Investment({
      user: req.user.id,
      plan: plan._id,
      investedAmount: plan.amount,
      expectedReturn: plan.expectedReturn,
      maturityDate
    });
    await investment.save();

    // Create purchase transaction
    const transaction = new Transaction({
      user: req.user.id,
      type: 'purchase',
      amount: plan.amount,
      status: 'approved',
      plan: plan._id,
      description: `Investment in ${plan.title} - Maturity: ${maturityDate.toLocaleDateString('en-IN')}`
    });
    await transaction.save();
    
    console.log(`✅ New investment created:`);
    console.log(`   User: ${user.email}`);
    console.log(`   Plan: ${plan.title}`);
    console.log(`   Amount: ₹${plan.amount.toLocaleString()}`);
    console.log(`   Expected Return: ₹${plan.expectedReturn.toLocaleString()}`);
    console.log(`   Maturity Date: ${maturityDate.toLocaleDateString('en-IN')}`);
    console.log(`   Remaining Wallet Balance: ₹${user.walletBalance.toLocaleString()}`);

    res.json({ 
      message: 'Investment successful! 🎉',
      investment: {
        ...investment.toObject(),
        plan: plan
      },
      newWalletBalance: user.walletBalance
    });

  } catch (error) {
    console.error('Investment purchase error:', error);
    res.status(500).json({ message: 'Investment failed. Please try again.' });
  }
});

// Admin: Get all plans for management
router.get('/admin/all', adminAuth, async (req, res) => {
  try {
    const categories = await PlanCategory.find();
    const plans = await InvestmentPlan.find().populate('category').sort({ createdAt: -1 });
    res.json({ categories, plans });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Create plan
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, category, amount, expectedReturn, duration, oneTimeOnly } = req.body;
    
    // Validate category exists
    const categoryExists = await PlanCategory.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    
    const plan = new InvestmentPlan({
      title, description, category, amount, expectedReturn, duration, oneTimeOnly
    });
    await plan.save();
    
    const populatedPlan = await InvestmentPlan.findById(plan._id).populate('category');
    res.status(201).json(populatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Update plan
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, category, amount, expectedReturn, duration, isActive, oneTimeOnly } = req.body;
    
    const plan = await InvestmentPlan.findByIdAndUpdate(
      req.params.id,
      { title, description, category, amount, expectedReturn, duration, isActive, oneTimeOnly },
      { new: true }
    ).populate('category');
    
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Delete plan
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    // Check if plan has active investments
    const activeInvestments = await Investment.countDocuments({ plan: req.params.id });
    if (activeInvestments > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete plan with active investments. Deactivate instead.' 
      });
    }
    
    await InvestmentPlan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's active investments
router.get('/my-investments', auth, async (req, res) => {
  try {
    const investments = await Investment.find({
      user: req.user.id,
      status: 'active'
    }).populate('plan');
    
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin: Toggle plan status
router.put('/:id/toggle-status', adminAuth, async (req, res) => {
  try {
    const plan = await InvestmentPlan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    plan.isActive = !plan.isActive;
    await plan.save();
    
    const updatedPlan = await InvestmentPlan.findById(plan._id).populate('category');
    res.json(updatedPlan);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;