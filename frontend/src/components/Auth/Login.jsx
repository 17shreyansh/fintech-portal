import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Segmented } from 'antd';
import { UserOutlined, LockOutlined, DollarOutlined, CrownOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.css';

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState('user');
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    const success = await login(values.email, values.password);
    if (success) {
      const user = JSON.parse(localStorage.getItem('user'));
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-pattern"></div>
      </div>
      
      <div className="login-content">
        <Card className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <DollarOutlined className="logo-icon" />
              <span className="logo-text">Adhani Gold</span>
            </div>
            <Title level={2} className="login-title">
              Welcome Back
            </Title>
            <Text className="login-subtitle">
              Sign in to your account to continue
            </Text>
            
            <div style={{ marginTop: 20, marginBottom: 20 }}>
              <Segmented
                options={[
                  {
                    label: 'User Login',
                    value: 'user',
                    icon: <UserOutlined />,
                  },
                  {
                    label: 'Admin Login',
                    value: 'admin',
                    icon: <CrownOutlined />,
                  },
                ]}
                value={loginType}
                onChange={setLoginType}
                style={{ width: '100%' }}
                size="large"
              />
            </div>
          </div>
          
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            className="login-form"
          >
            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: 'Please input your email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input 
                prefix={<UserOutlined className="input-icon" />} 
                placeholder="Enter your email"
                className="login-input"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="input-icon" />}
                placeholder="Enter your password"
                className="login-input"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                className="login-button"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="login-footer">
            <Link to="/forgot-password" className="forgot-link">
              Forgot your password?
            </Link>
            {loginType === 'user' && (
              <div className="register-link">
                Don't have an account? <Link to="/register" className="register-text">Create one</Link>
              </div>
            )}
            {loginType === 'admin' && (
              <div className="admin-info" style={{ textAlign: 'center', margin: '10px 0', color: '#8c8c8c', fontSize: '12px' }}>
                Admin access only • Contact support for admin credentials
              </div>
            )}
            <div className="back-home">
              <Link to="/" className="home-link">← Back to Home</Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;