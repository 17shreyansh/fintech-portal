import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

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
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '16px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: 600, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
      }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
            Join Adhani Gold
          </Title>
          
          <Form
            name="register"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Full Name" 
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<MailOutlined />} 
                placeholder="Email" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
                { min: 6, message: 'Password must be at least 6 characters!' }
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
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
                prefix={<LockOutlined />}
                placeholder="Confirm Password"
              />
            </Form.Item>

            <Typography.Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
              <BankOutlined /> Bank Account Details
            </Typography.Title>

            <Form.Item
              name={['bankDetails', 'accountHolderName']}
              rules={[{ required: true, message: 'Please enter account holder name!' }]}
            >
              <Input placeholder="Account Holder Name" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'accountNumber']}
                  rules={[
                    { required: true, message: 'Please enter account number!' },
                    { pattern: /^[0-9]{9,18}$/, message: 'Account number must be 9-18 digits!' }
                  ]}
                >
                  <Input placeholder="Account Number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'ifscCode']}
                  rules={[
                    { required: true, message: 'Please enter IFSC code!' },
                    { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC code format!' }
                  ]}
                >
                  <Input placeholder="IFSC Code" style={{ textTransform: 'uppercase' }} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'bankName']}
                  rules={[{ required: true, message: 'Please enter bank name!' }]}
                >
                  <Input placeholder="Bank Name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'branchName']}
                  rules={[{ required: true, message: 'Please enter branch name!' }]}
                >
                  <Input placeholder="Branch Name" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={['bankDetails', 'upiId']}
              rules={[
                { required: true, message: 'Please enter UPI ID!' },
                { pattern: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, message: 'Invalid UPI ID format!' }
              ]}
            >
              <Input placeholder="UPI ID (e.g., yourname@paytm)" />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ width: '100%' }}
              >
                Register
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Register;