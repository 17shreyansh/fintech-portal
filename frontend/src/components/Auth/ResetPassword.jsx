import { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, message } from 'antd';
import { LockOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      message.error('Invalid reset link');
      navigate('/login');
    }
  }, [token, navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await api.post('/auth/reset-password', {
        token,
        password: values.password
      });
      setSuccess(true);
      message.success('Password reset successfully!');
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to reset password');
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
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
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
              Set New Password
            </Title>
            <Text style={{ color: '#666' }}>
              Enter your new password below
            </Text>
          </div>

          {!success ? (
            <Form
              name="reset-password"
              onFinish={onFinish}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: true, message: 'Please enter your new password!' },
                  { min: 6, message: 'Password must be at least 6 characters!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter new password"
                />
              </Form.Item>

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
                  prefix={<LockOutlined />}
                  placeholder="Confirm new password"
                />
              </Form.Item>

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  style={{ width: '100%' }}
                >
                  Reset Password
                </Button>
              </Form.Item>
            </Form>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: '16px' }} />
              <Title level={4} style={{ color: '#52c41a' }}>Password Reset Successfully!</Title>
              <Text style={{ color: '#666', display: 'block', marginBottom: '20px' }}>
                Your password has been updated. You can now login with your new password.
              </Text>
              <Button type="primary" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/login" style={{ color: '#1890ff' }}>
              Back to Login
            </Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ResetPassword;