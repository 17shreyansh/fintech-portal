// Test validation functions
const testValidation = () => {
  console.log('Testing validation functions...');
  
  // Test amount validation
  const validateAmount = (value, min = 100, max = 10000000) => {
    const numValue = Number(value);
    if (!value) return 'Please enter amount';
    if (isNaN(numValue) || numValue <= 0) return 'Please enter a valid amount';
    if (numValue < min) return `Minimum amount is ₹${min}`;
    if (numValue > max) return `Maximum amount is ₹${max.toLocaleString('en-IN')}`;
    return 'Valid';
  };
  
  // Test cases
  console.log('Empty value:', validateAmount(''));
  console.log('Invalid value:', validateAmount('abc'));
  console.log('Negative value:', validateAmount('-100'));
  console.log('Below minimum:', validateAmount('50'));
  console.log('Valid amount:', validateAmount('5000'));
  console.log('Above maximum:', validateAmount('20000000'));
  
  console.log('All validation tests completed!');
};

testValidation();