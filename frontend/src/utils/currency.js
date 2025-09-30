// Currency formatting utilities for Indian Rupees

export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '₹0';
  
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return '₹0';
  
  // Format with Indian number system (lakhs, crores)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numAmount);
};

export const formatAmount = (amount) => {
  if (amount === null || amount === undefined) return '0';
  
  const numAmount = Number(amount);
  if (isNaN(numAmount)) return '0';
  
  return new Intl.NumberFormat('en-IN').format(numAmount);
};

export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  return Number(currencyString.replace(/[₹,]/g, ''));
};