import { useState, useEffect } from 'react';
import { Row, Col, Typography, Modal, Spin, Empty } from 'antd';
import toast from 'react-hot-toast';
import { TrophyOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import PlanCard from './PlanCard';

const { Title, Text, Paragraph } = Typography;

const InvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await api.get('/plans');
      setPlans(response.data.plans);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyPlan = (plan) => {
    console.log('🔍 handleBuyPlan called with plan:', plan);
    
    if (!plan || !plan._id) {
      console.error('❌ Invalid plan:', plan);
      toast.error('Invalid plan selected');
      return;
    }
    
    console.log('✅ Plan validation passed, opening modal');
    setSelectedPlan(plan);
    setConfirmModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedPlan) return;
    
    console.log('🚀 Confirm button clicked, making API call to buy plan:', selectedPlan._id);
    setBuyLoading(true);
    try {
      console.log('📞 Making API call to /plans/buy/' + selectedPlan._id);
      const response = await api.post(`/plans/buy/${selectedPlan._id}`);
      console.log('✅ API call successful:', response.data);
      
      toast.success(`🎉 Investment Successful! New Wallet Balance: ${formatCurrency(response.data.newWalletBalance)}`, {
        duration: 4000
      });
      setConfirmModalOpen(false);
      fetchPlans();
      
    } catch (error) {
      console.error('❌ Purchase failed:', error);
      toast.error(error.response?.data?.message || 'Investment failed. Please try again.');
    } finally {
      setBuyLoading(false);
    }
  };

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Silver': '#c0c0c0',
      'Gold': '#ffd700', 
      'Diamond': '#b9f2ff',
      'AI Robot': '#722ed1'
    };
    return colors[categoryName] || 'default';
  };

  const getCategoryGradient = (categoryName) => {
    const gradients = {
      'Silver': 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
      'Gold': 'linear-gradient(135deg, #fff9c4 0%, #ffeaa7 100%)',
      'Diamond': 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      'AI Robot': 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)'
    };
    return gradients[categoryName] || 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)';
  };



  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="investment-plans-container">
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <Title level={2} style={{ color: '#262626', marginBottom: 8 }}>
          <TrophyOutlined style={{ color: '#ffd700', marginRight: 8 }} />
          Investment Plans
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#8c8c8c', maxWidth: 600, margin: '0 auto' }}>
          Choose from our premium investment categories: Silver, Gold, Diamond, and AI Robot plans designed to maximize your returns in Indian Rupees
        </Paragraph>
      </div>
      
      {categories.map(category => (
        <div key={category._id} style={{ marginBottom: 50 }}>
          <div 
            style={{ 
              background: getCategoryGradient(category.name),
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '24px',
              border: '1px solid #f0f0f0'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '32px', marginRight: '12px' }}>{category.icon}</span>
              <Title level={3} style={{ margin: 0, color: '#262626' }}>
                {category.name} Plans
              </Title>
            </div>
            <Paragraph style={{ margin: 0, color: '#595959', fontSize: '16px' }}>
              {category.description}
            </Paragraph>
          </div>
          
          <Row gutter={[16, 16]}>
            {plans
              .filter(plan => plan.category._id === category._id)
              .map(plan => (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={plan._id}>
                  <PlanCard 
                    plan={plan} 
                    onBuyPlan={handleBuyPlan} 
                    loading={buyLoading}
                  />
                </Col>
              ))}
          </Row>
          
          {plans.filter(plan => plan.category._id === category._id).length === 0 && (
            <Empty 
              description={`No ${category.name.toLowerCase()} plans available`}
              style={{ padding: '40px 0' }}
            />
          )}
        </div>
      ))}
      
      <Modal
        title="🎯 Confirm Investment"
        open={confirmModalOpen}
        onOk={handleConfirmPurchase}
        onCancel={() => setConfirmModalOpen(false)}
        okText="🚀 Confirm Investment"
        cancelText="❌ Cancel"
        confirmLoading={buyLoading}
        width={600}
        centered
      >
        {selectedPlan && (
          <div>
            <h3>{selectedPlan.category?.icon} {selectedPlan.title}</h3>
            <p>Investment: {formatCurrency(selectedPlan.amount)}</p>
            <p>Expected Return: {formatCurrency(selectedPlan.expectedReturn)}</p>
            <p>Duration: {selectedPlan.duration?.value} {selectedPlan.duration?.unit}</p>
            <p><strong>Total Maturity: {formatCurrency(selectedPlan.amount + selectedPlan.expectedReturn)}</strong></p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestmentPlans;