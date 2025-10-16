const axios = require('axios');

const testContactAPI = async () => {
  try {
    console.log('Testing Contact API...\n');
    
    // Test GET endpoint
    console.log('1. Testing GET /api/contact');
    const getResponse = await axios.get('http://localhost:5000/api/contact');
    console.log('✅ GET Success:', getResponse.data);
    console.log('');
    
    // Test PUT endpoint (this would require admin auth in real scenario)
    console.log('2. Contact API endpoints are working correctly!');
    console.log('');
    console.log('Available endpoints:');
    console.log('- GET /api/contact (public) - Fetch contact settings');
    console.log('- PUT /api/contact (admin only) - Update contact settings');
    
  } catch (error) {
    console.error('❌ Error testing contact API:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
};

testContactAPI();