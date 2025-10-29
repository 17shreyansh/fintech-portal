import { useState, useEffect } from 'react';
import { Row, Col, Typography, Modal, Spin, Empty, Button } from 'antd';
import toast from 'react-hot-toast';
import { TrophyOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import PlanCard from './PlanCard';
import aiImage from '../../assets/ai.webp';
import goldImage from '../../assets/gold.jpg';
import silverImage from '../../assets/silver.jpg';
import dioImage from '../../assets/dio.jpg';

const { Title, Text, Paragraph } = Typography;

const InvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

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
    
    if (plan.isLocked) {
      toast.error('You already have an active investment in this plan');
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

  const getCategoryImage = (categoryName) => {
    const images = {
      'Silver': silverImage,
      'Gold': goldImage,
      'Diamond': dioImage,
      'AI Robot': aiImage
    };
    return images[categoryName] || silverImage;
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
  };



  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  // Show category selection view
  if (!selectedCategory) {
    return (
      <div className="investment-plans-container">
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <Title level={2} style={{ color: '#262626', marginBottom: 8 }}>
            <TrophyOutlined style={{ color: '#ffd700', marginRight: 8 }} />
            Investment Categories
          </Title>
          <Paragraph style={{ fontSize: 16, color: '#8c8c8c', maxWidth: 600, margin: '0 auto' }}>
            Choose from our premium investment categories designed to maximize your returns
          </Paragraph>
        </div>
        
        <Row gutter={[24, 24]} justify="center">
          {categories.map(category => (
            <Col xs={24} sm={12} md={12} lg={12} key={category._id}>
              <div
                onClick={() => handleCategoryClick(category)}
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: 'linear-gradient(180deg, #e6e6ff 0%, #ffffff 100%)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  width: '100%',
                  textAlign: 'center',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Image */}
                <div style={{ paddingTop: 32 }}>
                  <img
                    src={getCategoryImage(category.name)}
                    alt={category.name}
                    style={{ height: 120, objectFit: 'contain', mixBlendMode: 'multiply' }}
                  />
                </div>

                {/* Title */}
                <Title level={4} style={{ margin: '12px 0', color: '#262626' }}>
                  {category.name}
                </Title>

                {/* Description */}
                <div style={{ marginBottom: 16, padding: '0 16px' }}>
                  <Text style={{ display: 'block', color: '#595959', fontSize: 14 }}>
                    {category.description}
                  </Text>
                </div>

                {/* CTA */}
                <div style={{ padding: '0 16px 16px 16px', marginTop: 'auto' }}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    style={{
                      fontWeight: 'bold',
                      height: '44px',
                      borderRadius: '8px',
                    }}
                  >
                    View Plans
                  </Button>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    );
  }

  // Show plans for selected category
  const categoryPlans = plans.filter(plan => plan.category._id === selectedCategory._id);

  return (
    <div className="investment-plans-container">
      <div style={{ marginBottom: 32 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBackToCategories}
          style={{ marginBottom: 16 }}
        >
          Back to Categories
        </Button>
        
        <div 
          style={{ 
            background: getCategoryGradient(selectedCategory.name),
            padding: '24px',
            borderRadius: '16px',
            marginBottom: '24px',
            border: '2px solid #f0f0f0',
            textAlign: 'center'
          }}
        >
          <img
            src={getCategoryImage(selectedCategory.name)}
            alt={selectedCategory.name}
            style={{
              width: 60,
              height: 60,
              objectFit: 'contain',
              marginBottom: 12,
              borderRadius: 8
            }}
          />
          <Title level={2} style={{ margin: '0 0 8px 0', color: '#262626' }}>
            {selectedCategory.name} Plans
          </Title>
          <Paragraph style={{ margin: 0, color: '#595959', fontSize: '16px' }}>
            {selectedCategory.description}
          </Paragraph>
        </div>
      </div>
      
      <Row gutter={[16, 16]}>
        {categoryPlans.map(plan => (
          <Col xs={24} sm={12} md={8} lg={6} xl={6} key={plan._id}>
            <PlanCard 
              plan={plan} 
              onBuyPlan={handleBuyPlan} 
              loading={buyLoading}
            />
          </Col>
        ))}
      </Row>
      
      {categoryPlans.length === 0 && (
        <Empty 
          description={`No ${selectedCategory.name.toLowerCase()} plans available`}
          style={{ padding: '40px 0' }}
        />
      )}
      
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
            <p>You Will Get: {formatCurrency(selectedPlan.totalMaturityAmount)}</p>
            <p>Profit: {formatCurrency(selectedPlan.totalMaturityAmount - selectedPlan.amount)}</p>
            <p>Duration: {selectedPlan.duration?.value} {selectedPlan.duration?.unit}</p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InvestmentPlans;