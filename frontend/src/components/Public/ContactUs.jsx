import { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Form, Input, Button, message, Space } from 'antd';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SendOutlined
} from '@ant-design/icons';
import Navbar from './Navbar';
import Footer from './Footer';
import './ContactUs.css';

const { Title, Paragraph } = Typography;
const { TextArea } = Input;

const ContactUs = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/contact`);
      setContactInfo(response.data);
    } catch (error) {
      console.error('Failed to fetch contact info:', error);
      // Fallback to default data
      setContactInfo({
        email: 'support@fintech.com',
        phone: '+1 (555) 123-4567',
        address: '123 Financial District, New York, NY 10004',
        workingHours: 'Mon-Fri 9:00 AM - 6:00 PM',
        workingHoursDescription: 'We are here to help during business hours'
      });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Thank you for your message! We will get back to you soon.');
      form.resetFields();
    } catch (error) {
      message.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getContactInfoItems = () => {
    if (!contactInfo) return [];
    
    return [
      {
        icon: <MailOutlined className="contact-icon" />,
        title: "Email Us",
        content: contactInfo.email,
        description: "Send us an email anytime"
      },
      {
        icon: <PhoneOutlined className="contact-icon" />,
        title: "Call Us",
        content: contactInfo.phone,
        description: "Mon-Fri from 9am to 6pm"
      },
      {
        icon: <EnvironmentOutlined className="contact-icon" />,
        title: "Visit Us",
        content: contactInfo.address,
        description: "Come say hello at our office"
      },
      {
        icon: <ClockCircleOutlined className="contact-icon" />,
        title: "Working Hours",
        content: contactInfo.workingHours,
        description: contactInfo.workingHoursDescription
      }
    ];
  };



  return (
    <div className="contact-page">
      <Navbar />

      {/* Hero Section */}
      <section className="contact-hero">
        <div className="container">
          <div className="hero-content">
            <Title level={1} className="hero-title">Contact Us</Title>
            <Paragraph className="hero-description">
              Have questions about our investment plans or need support? We're here to help! 
              Reach out to us through any of the channels below.
            </Paragraph>
          </div>
        </div>
      </section>



      {/* Contact Form Section */}
      <section className="contact-form-section">
        <div className="container">
          <Row gutter={[48, 48]}>
            <Col xs={24} lg={12}>
              <div className="form-content">
                <Title level={2} className="section-title">Send us a Message</Title>
                <Paragraph className="section-description">
                  Fill out the form below and we'll get back to you as soon as possible.
                </Paragraph>
                
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleSubmit}
                  className="contact-form"
                >
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter your first name' }]}
                      >
                        <Input placeholder="Enter your first name" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter your last name' }]}
                      >
                        <Input placeholder="Enter your last name" />
                      </Form.Item>
                    </Col>
                  </Row>
                  
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' }
                    ]}
                  >
                    <Input placeholder="Enter your email address" />
                  </Form.Item>
                  
                  <Form.Item
                    name="phone"
                    label="Phone Number"
                    rules={[{ required: true, message: 'Please enter your phone number' }]}
                  >
                    <Input placeholder="Enter your phone number" />
                  </Form.Item>
                  
                  <Form.Item
                    name="subject"
                    label="Subject"
                    rules={[{ required: true, message: 'Please enter a subject' }]}
                  >
                    <Input placeholder="What is this regarding?" />
                  </Form.Item>
                  
                  <Form.Item
                    name="message"
                    label="Message"
                    rules={[{ required: true, message: 'Please enter your message' }]}
                  >
                    <TextArea 
                      rows={5} 
                      placeholder="Tell us more about your inquiry..."
                    />
                  </Form.Item>
                  
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={loading}
                      className="submit-btn"
                      icon={<SendOutlined />}
                    >
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </Col>
            
            <Col xs={24} lg={12}>
              <div className="contact-info-sidebar">
                <Title level={2} className="section-title">Get in Touch</Title>
                <div className="contact-info-list">
                  {getContactInfoItems().map((info, index) => (
                    <div key={index} className="contact-info-item">
                      {info.icon}
                      <div className="contact-info-details">
                        <h4 className="contact-info-title">{info.title}</h4>
                        <div className="contact-info-value">{info.content}</div>
                        <p className="contact-info-desc">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
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
                <button className="cta-button">Get Started</button>
              </Link>
              <Link to="/investment-plans">
                <button className="secondary-button">View Plans</button>
              </Link>
            </Space>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactUs;