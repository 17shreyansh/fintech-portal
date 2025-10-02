import { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
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
        maxWidth: 400, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
      }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 0 }}>
            Adhani Gold Login
          </Title>
          
          <Form
            name="login"
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
                prefix={<UserOutlined />} 
                placeholder="Email" 
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Password"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                style={{ width: '100%' }}
              >
                Log In
              </Button>
            </Form.Item>
          </Form>

          <div style={{ textAlign: 'center' }}>
            <Link to="/forgot-password" style={{ color: '#1890ff', marginBottom: 16, display: 'block' }}>
              Forgot Password?
            </Link>
            Don't have an account? <Link to="/register">Register now</Link>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default Login;