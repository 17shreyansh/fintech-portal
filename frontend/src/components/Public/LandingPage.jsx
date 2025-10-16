import { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Statistic, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { 
  TrophyOutlined, 
  SafetyCertificateOutlined, 
  RocketOutlined,
  UserOutlined,
  LineChartOutlined,
  SafetyOutlined,
  TeamOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import Footer from './Footer';
import './LandingPage.css';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalInvestments: 5680000,
    successRate: 98.5,
    plansAvailable: 12
  });

  const features = [
    {
      icon: <SafetyCertificateOutlined className="feature-icon" />,
      title: "Secure Investments",
      description: "Bank-grade security with encrypted transactions and secure investment management"
    },
    {
      icon: <LineChartOutlined className="feature-icon" />,
      title: "High Returns",
      description: "Competitive returns across multiple investment categories with transparent pricing"
    },
    {
      icon: <SafetyOutlined className="feature-icon" />,
      title: "Risk Management",
      description: "Diversified portfolio options with professional risk assessment and management"
    },
    {
      icon: <TeamOutlined className="feature-icon" />,
      title: "Expert Support",
      description: "24/7 customer support with dedicated investment advisors for guidance"
    }
  ];

  return (
    <div className="landing-page">
      <Navbar />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <Row align="middle" gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <div className="hero-content">
                <Title level={1} className="hero-title">
                  Smart Investment Solutions for Your <span className="highlight">Financial Future</span>
                </Title>
                <Paragraph className="hero-description">
                  Join thousands of investors who trust our platform for secure, high-return investment opportunities. 
                  Start building your wealth today with our expertly curated investment plans.
                </Paragraph>
                <Space size="large" className="hero-actions">
                  <Link to="/register">
                    <Button type="primary" size="large" className="cta-button">
                      <RocketOutlined /> Start Investing
                    </Button>
                  </Link>
                  <Link to="/investment-plans">
                    <Button size="large" className="secondary-button">
                      View Plans
                    </Button>
                  </Link>
                </Space>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="hero-visual">
                <div className="stats-grid">
                  <Card className="stat-card">
                    <Statistic 
                      title="Active Users" 
                      value={stats.totalUsers} 
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#d4af37' }}
                    />
                  </Card>
                  <Card className="stat-card">
                    <Statistic 
                      title="Total Investments" 
                      value={stats.totalInvestments} 
                      prefix="₹"
                      precision={0}
                      valueStyle={{ color: '#52c41a' }}
                    />
                  </Card>
                  <Card className="stat-card">
                    <Statistic 
                      title="Success Rate" 
                      value={stats.successRate} 
                      suffix="%"
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                  <Card className="stat-card">
                    <Statistic 
                      title="Investment Plans" 
                      value={stats.plansAvailable} 
                      prefix={<TrophyOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">Why Choose Our Platform?</Title>
            <Paragraph className="section-description">
              We provide comprehensive investment solutions with cutting-edge technology and expert guidance
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="feature-card" hoverable>
                  <div className="feature-content">
                    {feature.icon}
                    <Title level={4} className="feature-title">{feature.title}</Title>
                    <Paragraph className="feature-description">{feature.description}</Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">Ready to Start Your Investment Journey?</Title>
            <Paragraph className="cta-description">
              Join our community of successful investors and start building your financial future today
            </Paragraph>
            <Space size="large">
              <Link to="/register">
                <Button type="primary" size="large" className="cta-button">
                  Get Started Now
                </Button>
              </Link>
              <Link to="/investment-plans">
                <Button size="large" className="secondary-button">
                  Explore Plans
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

export default LandingPage;