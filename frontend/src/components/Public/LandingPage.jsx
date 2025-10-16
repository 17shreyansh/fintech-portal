import { useState, useEffect } from 'react';
import { Button, Card, Row, Col, Statistic, Typography, Space, Avatar, Rate } from 'antd';
import { Link } from 'react-router-dom';
import { 
  TrophyOutlined, 
  SafetyCertificateOutlined, 
  RocketOutlined,
  UserOutlined,
  LineChartOutlined,
  SafetyOutlined,
  TeamOutlined,
  StarFilled
} from '@ant-design/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import './LandingPage.css';

const { Title, Paragraph } = Typography;

const LandingPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 1250,
    totalInvestments: "5680000/-",
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

  const reviews = [
    {
      id: 1,
      name: "Rajesh Kumar",
      avatar: "RK",
      rating: 5,
      review: "Excellent platform with consistent returns. I've been investing for 2 years and very satisfied with the results.",
      investment: "₹2,50,000",
      returns: "18.5%"
    },
    {
      id: 2,
      name: "Priya Sharma",
      avatar: "PS",
      rating: 5,
      review: "User-friendly interface and transparent processes. The customer support team is very responsive and helpful.",
      investment: "₹1,80,000",
      returns: "16.2%"
    },
    {
      id: 3,
      name: "Amit Patel",
      avatar: "AP",
      rating: 4,
      review: "Great investment options with good returns. The withdrawal process is smooth and hassle-free.",
      investment: "₹3,20,000",
      returns: "19.8%"
    },
    {
      id: 4,
      name: "Sneha Gupta",
      avatar: "SG",
      rating: 5,
      review: "Highly recommend this platform. Professional service and excellent returns on my investments.",
      investment: "₹1,50,000",
      returns: "17.3%"
    },
    {
      id: 5,
      name: "Vikram Singh",
      avatar: "VS",
      rating: 5,
      review: "Trustworthy platform with secure transactions. Been investing for 18 months with great results.",
      investment: "₹4,00,000",
      returns: "20.1%"
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

      {/* Customer Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">What Our Customers Say</Title>
            <Paragraph className="section-description">
              Join thousands of satisfied investors who trust our platform
            </Paragraph>
          </div>
          <div className="reviews-carousel">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              spaceBetween={30}
              slidesPerView={1}
              autoplay={{
                delay: 4000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              navigation={true}
              breakpoints={{
                768: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="reviews-swiper"
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <Card className="review-card">
                    <div className="review-header">
                      <Avatar size={48} className="review-avatar">
                        {review.avatar}
                      </Avatar>
                      <div className="review-info">
                        <Title level={5} className="reviewer-name">{review.name}</Title>
                        <Rate disabled defaultValue={review.rating} className="review-rating" />
                      </div>
                    </div>
                    <Paragraph className="review-text">"{review.review}"</Paragraph>
                    <div className="review-stats">
                      <div className="stat">
                        <span className="stat-label">Investment:</span>
                        <span className="stat-value">{review.investment}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Returns:</span>
                        <span className="stat-value returns">{review.returns}</span>
                      </div>
                    </div>
                  </Card>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
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