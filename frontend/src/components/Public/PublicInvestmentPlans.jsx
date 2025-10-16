import { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Typography, Tag, Spin, message, Space } from 'antd';
import { Link } from 'react-router-dom';
import {
  TrophyOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './PublicInvestmentPlans.css';
import inhImage from '../../assets/inh.jpeg';

const { Title, Paragraph, Text } = Typography;

const PublicInvestmentPlans = () => {
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      console.log('Fetching plans from:', `${apiUrl}/api/plans/public`);

      // Test if backend is reachable
      try {
        await axios.get(`${apiUrl}/health`);
        console.log('Backend is reachable');
      } catch (healthError) {
        console.error('Backend health check failed:', healthError);
        throw new Error('Backend server is not running');
      }

      const response = await axios.get(`${apiUrl}/api/plans/public`);
      console.log('API Response:', response.data);
      setPlans(response.data.plans || []);
      setCategories(response.data.categories || []);
      setError(null);
    } catch (error) {
      console.error('Failed to load investment plans:', error);
      setError(error.message || 'Failed to load investment plans');
      message.error(error.message || 'Failed to load investment plans');
      setPlans([]);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredPlans = selectedCategory === 'all'
    ? plans
    : plans.filter(plan => plan.category._id === selectedCategory);

  const formatDuration = (duration) => {
    return `${duration.value} ${duration.unit}`;
  };

  const calculateROI = (amount, expectedReturn) => {
    return (((expectedReturn - amount) / amount) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading investment plans...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="loading-container">
        <p>Error loading investment plans. Please try again later.</p>
        <Button onClick={fetchPlans}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="public-plans-page">
      <Navbar />

      {/* Hero Section */}
      <section className="plans-hero" style={{
        backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%), url(${inhImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
        padding: '6rem 0',
        textAlign: 'center',
        position: 'relative'
      }}>
        <div className="container">
          <div className="hero-content">
            <Title level={1} className="hero-title">Investment Plans</Title>
            <Paragraph className="hero-description">
              Choose from our carefully curated investment plans designed to maximize your returns
              while managing risk effectively.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="plans-section">
        <div className="container">
          {/* Category Filter */}
          <div className="category-filter">
            <Space wrap>
              <Button
                type={selectedCategory === 'all' ? 'primary' : 'default'}
                onClick={() => setSelectedCategory('all')}
                className="category-btn"
              >
                All Plans
              </Button>
              {categories && categories.length > 0 && categories.map(category => (
                <Button
                  key={category._id}
                  type={selectedCategory === category._id ? 'primary' : 'default'}
                  onClick={() => setSelectedCategory(category._id)}
                  className="category-btn"
                >
                  {category.name}
                </Button>
              ))}
            </Space>
          </div>

          {/* Plans Grid */}
          <Row gutter={[24, 24]} className="plans-grid">
            {filteredPlans && filteredPlans.length > 0 && filteredPlans.map(plan => (
              <Col xs={24} sm={12} lg={8} key={plan._id}>
                <Card className="plan-card" hoverable>
                  <div className="plan-header">
                    <div className="plan-category">
                      <Tag color="gold">{plan.category?.name || 'General'}</Tag>
                      {plan.oneTimeOnly && <Tag color="red">One Time Only</Tag>}
                    </div>
                    <Title level={4} className="plan-title">{plan.title}</Title>
                  </div>

                  <div className="plan-amount">
                    <Text className="amount-label">Investment Amount</Text>
                    <Title level={2} className="amount-value">
                      ₹{plan.amount.toLocaleString()}
                    </Title>
                  </div>

                  <div className="plan-returns">
                    <div className="return-item">
                      <TrophyOutlined className="return-icon" />
                      <div>
                        <Text className="return-label">Expected Return</Text>
                        <div className="return-value">₹{plan.expectedReturn.toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="return-item">
                      <ClockCircleOutlined className="return-icon" />
                      <div>
                        <Text className="return-label">Duration</Text>
                        <div className="return-value">{formatDuration(plan.duration)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="roi-badge">
                    <Text className="roi-text">
                      {calculateROI(plan.amount, plan.expectedReturn)}% ROI
                    </Text>
                  </div>

                  <Paragraph className="plan-description">
                    {plan.description}
                  </Paragraph>

                  <div className="plan-actions">
                    <Link to="/register">
                      <Button type="primary" block className="invest-btn">
                        Start Investing <ArrowRightOutlined />
                      </Button>
                    </Link>
                    <Text className="login-text">
                      Already have an account? <Link to="/login">Login here</Link>
                    </Text>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>

          {(!filteredPlans || filteredPlans.length === 0) && (
            <div className="no-plans">
              <Title level={4}>No plans available in this category</Title>
              <Paragraph>Please check other categories or contact support for more information.</Paragraph>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">Ready to Start Investing?</Title>
            <Paragraph className="cta-description">
              Join thousands of investors who have already started their journey to financial freedom
            </Paragraph>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="large" className="secondary-button">
                  Login
                </Button>
              </Link>
            </Space>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PublicInvestmentPlans;