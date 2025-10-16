import { Card, Row, Col, Typography, Timeline, Statistic } from 'antd';
import { Link } from 'react-router-dom';
import { 
  TeamOutlined, 
  TrophyOutlined,
  SafetyOutlined,
  CheckOutlined,
  RocketOutlined,
  HeartOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import Footer from './Footer';
import './AboutUs.css';

const { Title, Paragraph } = Typography;

const AboutUs = () => {
  const stats = [
    { title: "Years of Experience", value: 8, prefix: <TrophyOutlined /> },
    { title: "Happy Investors", value: 5000, suffix: "+", prefix: <TeamOutlined /> },
    { title: "Total Investments", value: 50000000, prefix: "₹", precision: 0 },
    { title: "Success Rate", value: 98.5, suffix: "%", prefix: <CheckOutlined /> }
  ];

  const values = [
    {
      icon: <SafetyOutlined className="value-icon" />,
      title: "Security First",
      description: "We prioritize the security of your investments with bank-grade encryption and secure protocols."
    },
    {
      icon: <HeartOutlined className="value-icon" />,
      title: "Customer Centric",
      description: "Our customers are at the heart of everything we do. We provide 24/7 support and personalized service."
    },
    {
      icon: <TrophyOutlined className="value-icon" />,
      title: "Excellence",
      description: "We strive for excellence in all our services and continuously improve our investment strategies."
    },
    {
      icon: <RocketOutlined className="value-icon" />,
      title: "Innovation",
      description: "We leverage cutting-edge technology to provide innovative investment solutions for modern investors."
    }
  ];

  const timeline = [
    {
      children: (
        <div>
          <Title level={5}>Company Founded</Title>
          <Paragraph>Started with a vision to democratize investment opportunities for everyone.</Paragraph>
        </div>
      )
    },
    {
      children: (
        <div>
          <Title level={5}>First 1000 Investors</Title>
          <Paragraph>Reached our first milestone of 1000 satisfied investors within the first year.</Paragraph>
        </div>
      )
    },
    {
      children: (
        <div>
          <Title level={5}>Platform Expansion</Title>
          <Paragraph>Expanded our platform with multiple investment categories and enhanced security features.</Paragraph>
        </div>
      )
    },
    {
      children: (
        <div>
          <Title level={5}>5000+ Investors</Title>
          <Paragraph>Crossed 5000 active investors with over ₹50 crores in total investments.</Paragraph>
        </div>
      )
    }
  ];

  return (
    <div className="about-page">
      <Navbar />

      {/* Hero Section */}
      <section className="about-hero">
        <div className="container">
          <div className="hero-content">
            <Title level={1} className="hero-title">About Adhani Investment Group</Title>
            <Paragraph className="hero-description">
              We are a leading investment platform dedicated to providing secure, profitable, and accessible 
              investment opportunities for individuals looking to build their financial future.
            </Paragraph>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <Row gutter={[32, 32]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="stat-card">
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    precision={stat.precision}
                    valueStyle={{ color: '#d4af37', fontSize: '2rem', fontWeight: 'bold' }}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <Row gutter={[48, 48]} align="middle">
            <Col xs={24} lg={12}>
              <div className="mission-content">
                <Title level={2} className="section-title">Our Mission</Title>
                <Paragraph className="mission-text">
                  To democratize investment by providing accessible, secure, and profitable investment 
                  opportunities for everyone, regardless of their financial background or investment experience.
                </Paragraph>
                <Paragraph className="mission-text">
                  We believe that everyone deserves the opportunity to build wealth and secure their financial 
                  future through smart investments and expert guidance.
                </Paragraph>
              </div>
            </Col>
            <Col xs={24} lg={12}>
              <div className="mission-visual">
                <div className="mission-card">
                  <RocketOutlined className="mission-icon" />
                  <Title level={4}>Growing Together</Title>
                  <Paragraph>
                    We grow when our investors grow. Your success is our success.
                  </Paragraph>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <Title level={2} className="section-title">Our Core Values</Title>
            <Paragraph className="section-description">
              These values guide everything we do and shape our commitment to our investors
            </Paragraph>
          </div>
          <Row gutter={[32, 32]}>
            {values.map((value, index) => (
              <Col xs={24} sm={12} lg={6} key={index}>
                <Card className="value-card" hoverable>
                  <div className="value-content">
                    {value.icon}
                    <Title level={4} className="value-title">{value.title}</Title>
                    <Paragraph className="value-description">{value.description}</Paragraph>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </section>

      {/* Journey Section */}
      <section className="journey-section">
        <div className="container">
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <Title level={2} className="section-title">Our Journey</Title>
              <Paragraph className="journey-description">
                From a small startup to a trusted investment platform serving thousands of investors, 
                our journey has been marked by continuous growth and unwavering commitment to our mission.
              </Paragraph>
            </Col>
            <Col xs={24} lg={12}>
              <Timeline
                mode="left"
                items={timeline}
                className="journey-timeline"
              />
            </Col>
          </Row>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <Title level={2} className="cta-title">Ready to Join Our Community?</Title>
            <Paragraph className="cta-description">
              Start your investment journey with us today and become part of our growing community of successful investors
            </Paragraph>
            <div className="cta-actions">
              <Link to="/register">
                <button className="cta-button">Get Started</button>
              </Link>
              <Link to="/investment-plans">
                <button className="secondary-button">View Plans</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AboutUs;