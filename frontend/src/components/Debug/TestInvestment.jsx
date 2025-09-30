import { useState } from 'react';
import { Button, message } from 'antd';
import api from '../../services/api';

const TestInvestment = () => {
  const [loading, setLoading] = useState(false);

  const testPurchase = async () => {
    setLoading(true);
    try {
      console.log('🔍 Testing investment purchase...');
      
      // Check token
      const token = localStorage.getItem('token');
      console.log('🔑 Token exists:', !!token);
      
      // Test API call
      const response = await api.post('/plans/buy/68db63f3064b1da00989e8ac');
      console.log('✅ Purchase successful:', response.data);
      
      message.success('Test purchase successful!');
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      message.error('Test purchase failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Investment Purchase Test</h3>
      <Button 
        type="primary" 
        loading={loading} 
        onClick={testPurchase}
      >
        Test Purchase Silver Starter Plan
      </Button>
    </div>
  );
};

export default TestInvestment;