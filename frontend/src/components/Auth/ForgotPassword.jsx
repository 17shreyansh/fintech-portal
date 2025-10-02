import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email: values.email });
      setEmailSent(true);
      message.success('Password reset email sent successfully!');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
      padding: '16px'
    }}>
      <Card style={{ 
        width: '100%', 
        maxWidth: 400, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
      }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <Title level={2} style={{ marginBottom: 8 }}>
              Reset Password
            </Title>
            <Text style={{ color: '#666' }}>
              Enter your email to receive reset instructions
            </Text>
          </div>

          {!emailSent ? (
            <Form
              name="forgot-password"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Please input your email!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="Enter your email address" 
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  Send Reset Email
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <Title level={4} style={{ color: '#52c41a' }}>Email Sent!</Title>
              <Text style={{ color: '#666', display: 'block', marginBottom: '20px' }}>
                Check your email for password reset instructions.
              </Text>
              <Button type="default" onClick={() => setEmailSent(false)}>
                Send Another Email
              </Button>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#1890ff' }}>
              <ArrowLeftOutlined /> Back to Login
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ForgotPassword;