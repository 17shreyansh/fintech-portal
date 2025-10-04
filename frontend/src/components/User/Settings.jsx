import { useState, useEffect } from 'react';
import { 
  Card, 
  Form, 
  Input, 
  Button, 
  message, 
  Typography, 
  Row, 
  Col,
  Avatar,
  Space,
  Divider,
  Switch,
  Select,
  Alert
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  SettingOutlined,
  MailOutlined,
  PhoneOutlined,
  BellOutlined,
  SafetyOutlined,
  EditOutlined,
  BankOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const { Title, Text } = Typography;
const { Option } = Select;

const Settings = () => {
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/user/profile');
      setUserProfile(response.data);
      profileForm.setFieldsValue({
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileUpdate = async (values) => {
    setProfileLoading(true);
    try {
      await api.put('/user/profile', { name: values.name });
      message.success('Profile updated successfully! 🎉');
      fetchUserProfile();
    } catch (error) {
      message.error(error.response?.data?.message || 'Profile update failed');
    } finally {
      setProfileLoading(false);
    }
  };



  const handlePasswordChange = async (values) => {
    setLoading(true);
    try {
      await api.put('/user/change-password', {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      message.success('Password changed successfully! 🔒');
      passwordForm.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-container">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#262626', marginBottom: 8 }}>
          <SettingOutlined /> Account Settings
        </Title>
        <Text style={{ fontSize: 16, color: '#8c8c8c' }}>
          Manage your account preferences and security settings
        </Text>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={8}>
          <Card className="profile-card">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <Avatar 
                size={80} 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff', marginBottom: 16 }}
              />
              <Title level={4} style={{ margin: 0 }}>{userProfile?.name || 'Loading...'}</Title>
              <Text style={{ color: '#8c8c8c' }}>{userProfile?.email || 'Loading...'}</Text>
            </div>
            
            <div style={{ padding: '20px 0', textAlign: 'center' }}>
              <Text style={{ color: '#8c8c8c', fontSize: '14px' }}>
                Manage your account settings and preferences
              </Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Card 
              title={
                <Space>
                  <EditOutlined />
                  <span>Profile Information</span>
                </Space>
              }
              className="form-card"
            >
              <Form
                form={profileForm}
                onFinish={handleProfileUpdate}
                layout="vertical"
              >
                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="name"
                      label="Full Name"
                      rules={[{ required: true, message: 'Please enter your name' }]}
                    >
                      <Input 
                        prefix={<UserOutlined />} 
                        size="large"
                        placeholder="Enter your full name"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="email"
                      label="Email Address"
                    >
                      <Input 
                        prefix={<MailOutlined />} 
                        disabled 
                        size="large"
                        style={{ backgroundColor: '#f5f5f5' }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={profileLoading}
                    size="large"
                    style={{ fontWeight: 'bold' }}
                  >
                    Update Profile
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card 
              title={
                <Space>
                  <BankOutlined />
                  <span>Bank Account Details</span>
                </Space>
              }
              className="form-card"
            >
              {userProfile?.bankDetails ? (
                <div>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>Account Holder Name</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', marginTop: 4 }}>
                          {userProfile.bankDetails.accountHolderName}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>Account Number</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', marginTop: 4 }}>
                          {userProfile.maskedAccountNumber}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>IFSC Code</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', marginTop: 4 }}>
                          {userProfile.bankDetails.ifscCode}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>Bank Name</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', marginTop: 4 }}>
                          {userProfile.bankDetails.bankName}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col xs={24} sm={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>Branch Name</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', marginTop: 4 }}>
                          {userProfile.bankDetails.branchName}
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={{ marginBottom: 16 }}>
                        <Text strong>UPI ID</Text>
                        <div style={{ padding: '8px 12px', background: '#f5f5f5', borderRadius: '6px', marginTop: 4, fontFamily: 'monospace' }}>
                          {userProfile.bankDetails.upiId}
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Alert
                    message="Bank Details Locked"
                    description="For security reasons, bank details can only be modified by admin support. Contact support if you need to update your bank information."
                    type="info"
                    showIcon
                    style={{ marginTop: 16 }}
                  />
                </div>
              ) : (
                <Alert
                  message="No Bank Details Found"
                  description="No bank account information is available. Contact admin support to add your bank details."
                  type="warning"
                  showIcon
                />
              )}
            </Card>

            <Card 
              title={
                <Space>
                  <LockOutlined />
                  <span>Password Management</span>
                </Space>
              }
              className="form-card"
            >
              <Alert
                message="Password Security"
                description="Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and special characters."
                type="info"
                showIcon
                style={{ marginBottom: 20 }}
              />
              
              <div style={{ marginBottom: 20, padding: 16, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 6 }}>
                <Text strong style={{ color: '#389e0d' }}>Alternative: Reset Password via Email</Text>
                <div style={{ marginTop: 8 }}>
                  <Text style={{ color: '#666', fontSize: 14 }}>Forgot your current password? Use email reset instead.</Text>
                  <div style={{ marginTop: 8 }}>
                    <Button 
                      type="link" 
                      style={{ padding: 0, height: 'auto' }}
                      onClick={() => window.open('/forgot-password', '_blank')}
                    >
                      Send Password Reset Email
                    </Button>
                  </div>
                </div>
              </div>
              
              <Form
                form={passwordForm}
                onFinish={handlePasswordChange}
                layout="vertical"
              >
                <Form.Item
                  name="currentPassword"
                  label="Current Password"
                  rules={[{ required: true, message: 'Please enter current password' }]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    size="large"
                    placeholder="Enter current password"
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="newPassword"
                      label="New Password"
                      rules={[
                        { required: true, message: 'Please enter new password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                      ]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined />} 
                        size="large"
                        placeholder="Enter new password"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      name="confirmPassword"
                      label="Confirm New Password"
                      dependencies={['newPassword']}
                      rules={[
                        { required: true, message: 'Please confirm new password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('newPassword') === value) {
                              return Promise.resolve();
                            }
                            return Promise.reject(new Error('Passwords do not match'));
                          },
                        }),
                      ]}
                    >
                      <Input.Password 
                        prefix={<LockOutlined />} 
                        size="large"
                        placeholder="Confirm new password"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    loading={loading}
                    size="large"
                    style={{ fontWeight: 'bold' }}
                  >
                    Change Password
                  </Button>
                </Form.Item>
              </Form>
            </Card>

            <Card 
              title={
                <Space>
                  <BellOutlined />
                  <span>Notification Preferences</span>
                </Space>
              }
              className="form-card"
            >
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="notification-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Email Notifications</Text>
                      <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                        Receive updates about your investments and transactions
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div className="notification-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Investment Updates</Text>
                      <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                        Get notified about new investment opportunities
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <Divider style={{ margin: '12px 0' }} />
                
                <div className="notification-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <Text strong>Security Alerts</Text>
                      <div style={{ color: '#8c8c8c', fontSize: '12px' }}>
                        Important security notifications (recommended)
                      </div>
                    </div>
                    <Switch defaultChecked disabled />
                  </div>
                </div>
              </Space>
            </Card>
          </Space>
        </Col>
      </Row>
    </div>
  );
};

export default Settings;