import { useState, useEffect } from 'react';
import { Row, Col, Typography } from 'antd';
import { Link } from 'react-router-dom';
import { DollarOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Footer.css';

const { Title, Paragraph } = Typography;

const Footer = () => {
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/contact`);
      setContactInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
    }
  };
  return (
    <footer className="public-footer">
      <div className="container">
        <Row gutter={[32, 32]}>
          <Col xs={24} md={8}>
            <div className="footer-section">
              <Link to="/" className="footer-logo">
                <DollarOutlined className="logo-icon" />
                <span className="logo-text">Adhani Investment Group</span>
              </Link>
              <Paragraph className="footer-description">
                Your trusted partner for investment solutions and financial growth
              </Paragraph>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="footer-section">
              <Title level={5} className="footer-title">Quick Links</Title>
              <div className="footer-links">
                <Link to="/" className="footer-link">Home</Link>
                <Link to="/investment-plans" className="footer-link">Investment Plans</Link>
                <Link to="/about" className="footer-link">About Us</Link>
                <Link to="/contact" className="footer-link">Contact</Link>
                <Link to="/login" className="footer-link">Login</Link>
              </div>
            </div>
          </Col>
          <Col xs={24} md={8}>
            <div className="footer-section">
              <Title level={5} className="footer-title">Contact Info</Title>
              <div className="contact-info">
                <p>Email: {contactInfo?.email || 'support@adhanigroup.com'}</p>
                <p>Phone: {contactInfo?.phone || '+91 98765 43210'}</p>
                <p>Address: {contactInfo?.address || 'Mumbai, India'}</p>
              </div>
            </div>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p>&copy; 2024 Adhani Investment Group. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;