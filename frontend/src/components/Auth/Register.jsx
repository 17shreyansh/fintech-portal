import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined, DollarOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Register.css';

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const { confirmPassword, ...registerData } = values;
    const success = await register(registerData);
    if (success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-background">
        <div className="register-pattern"></div>
      </div>
      
      <div className="register-content">
        <Card className="register-card">
          <div className="register-header">
            <div className="register-logo">
              <DollarOutlined className="logo-icon" />
              <span className="logo-text">Adhani Gold</span>
            </div>
            <Title level={2} className="register-title">
              Create Account
            </Title>
            <Text className="register-subtitle">
              Join thousands of successful investors
            </Text>
          </div>
          
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            className="register-form"
          >
            <Form.Item
              name="name"
              label="Full Name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input 
                prefix={<UserOutlined className="input-icon" />} 
                placeholder="Enter your full name"
                className="register-input"
              />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined className="input-icon" />} 
                placeholder="Enter your email"
                className="register-input"
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    { min: 6, message: 'Password must be at least 6 characters!' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="input-icon" />}
                    placeholder="Create password"
                    className="register-input"
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: 'Please confirm your password!' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('Passwords do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="input-icon" />}
                    placeholder="Confirm password"
                    className="register-input"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="section-divider">
              <BankOutlined className="section-icon" />
              <Title level={4} className="section-title">Bank Account Details</Title>
            </div>

            <Form.Item
              name={['bankDetails', 'accountHolderName']}
              label="Account Holder Name"
              rules={[{ required: true, message: 'Please enter account holder name!' }]}
            >
              <Input placeholder="Enter account holder name" className="register-input" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'accountNumber']}
                  label="Account Number"
                  rules={[
                    { required: true, message: 'Please enter account number!' },
                    { pattern: /^[0-9]{9,18}$/, message: 'Account number must be 9-18 digits!' }
                  ]}
                >
                  <Input placeholder="Enter account number" className="register-input" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'ifscCode']}
                  label="IFSC Code"
                  rules={[
                    { required: true, message: 'Please enter IFSC code!' }
                  ]}
                >
                  <Input placeholder="Enter IFSC code" className="register-input" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={['bankDetails', 'bankName']}
              label="Bank Name"
              rules={[{ required: true, message: 'Please enter bank name!' }]}
            >
              <Input placeholder="Enter bank name" className="register-input" />
            </Form.Item>

            <Form.Item
              name={['bankDetails', 'upiId']}
              label="UPI ID"
              rules={[
                { required: true, message: 'Please enter UPI ID!' },
                { pattern: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, message: 'Invalid UPI ID format!' }
              ]}
            >
              <Input placeholder="yourname@paytm" className="register-input" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="register-button"
              >
                Create Account
              </Button>
            </Form.Item>
          </Form>

          <div className="register-footer">
            <div className="login-link">
              Already have an account? <Link to="/login" className="login-text">Sign in</Link>
            </div>
            <div className="back-home">
              <Link to="/" className="home-link">← Back to Home</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;