import { useState, useEffect } from 'react';
import { Card, Form, Input, Button, message, Typography, Space } from 'antd';
import { SaveOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined, ClockCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

const { Title } = Typography;
const { TextArea } = Input;

const ContactManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/contact`);
      form.setFieldsValue(response.data);
    } catch (error) {
      message.error('Failed to fetch contact settings');
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/contact`, values, {
        headers: { Authorization: `Bearer ${token}` }
      });
      message.success('Contact settings updated successfully');
    } catch (error) {
      message.error('Failed to update contact settings');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Title level={2}>Contact Settings</Title>
      
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: 'Please enter email address' },
              { type: 'email', message: 'Please enter a valid email' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="support@company.com" 
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input 
              prefix={<PhoneOutlined />} 
              placeholder="+91 98765 43210" 
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please enter address' }]}
          >
            <TextArea 
              rows={3}
              placeholder="Company address"
            />
          </Form.Item>

          <Form.Item
            name="workingHours"
            label="Working Hours"
            rules={[{ required: true, message: 'Please enter working hours' }]}
          >
            <Input 
              prefix={<ClockCircleOutlined />} 
              placeholder="Mon - Fri: 9:00 AM - 6:00 PM" 
            />
          </Form.Item>

          <Form.Item
            name="workingHoursDescription"
            label="Additional Hours Info"
          >
            <Input 
              placeholder="Saturday: 10:00 AM - 4:00 PM" 
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button 
                type="primary" 
                htmlType="submit" 
                loading={loading}
                icon={<SaveOutlined />}
              >
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ContactManagement;