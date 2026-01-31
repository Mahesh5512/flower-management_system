// Simulate the exact scenario that might be causing the issue
const testCases = [
  '₹4988.34',
  '₹0.00',
  '₹ 4988.34' // With space
];

console.log('Testing total extraction:');
testCases.forEach((testCase, index) => {
  const total = testCase.replace('₹', '');
  console.log(`Test ${index + 1}: "${testCase}" -> "${total}" -> parseFloat: ${parseFloat(total)}`);
  
  // Check if parseFloat results in NaN
  if (isNaN(parseFloat(total))) {
    console.log(`  WARNING: parseFloat resulted in NaN!`);
  }
});

// Test a more robust approach
console.log('\nTesting improved extraction:');
testCases.forEach((testCase, index) => {
  // Remove currency symbols and any whitespace
  const total = testCase.replace(/[\$\₹]/g, '').trim();
  console.log(`Test ${index + 1}: "${testCase}" -> "${total}" -> parseFloat: ${parseFloat(total)}`);
  
  // Check if parseFloat results in NaN
  if (isNaN(parseFloat(total))) {
    console.log(`  WARNING: parseFloat resulted in NaN!`);
  }
});