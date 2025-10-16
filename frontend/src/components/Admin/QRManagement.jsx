import { useState, useEffect } from 'react';
import { Card, Form, Input, Upload, Button, message, Image, Typography, Space } from 'antd';
import { QrcodeOutlined, UploadOutlined, SaveOutlined } from '@ant-design/icons';
import api from '../../services/api';

const { Title, Text } = Typography;

const QRManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentQR, setCurrentQR] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    fetchQRSettings();
  }, []);

  const fetchQRSettings = async () => {
    try {
      const response = await api.get('/admin/qr-settings');
      if (response.data) {
        setCurrentQR(response.data);
        form.setFieldsValue({
          upiId: response.data.upiId
        });
      }
    } catch (error) {
      console.error('Error fetching QR settings:', error);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('upiId', values.upiId);
    
    if (fileList.length > 0 && fileList[0].originFileObj) {
      formData.append('qrCode', fileList[0].originFileObj);
    }

    try {
      await api.post('/admin/qr-settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      message.success('QR settings updated successfully!');
      fetchQRSettings();
      setFileList([]);
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update QR settings');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: 'image/*',
    fileList,
    onChange: ({ fileList }) => setFileList(fileList),
    listType: 'picture-card'
  };

  return (
    <div>
      <Title level={2}>
        <QrcodeOutlined /> QR Code Management
      </Title>
      <Text style={{ fontSize: 16, color: '#8c8c8c', marginBottom: 24, display: 'block' }}>
        Manage deposit QR code and UPI ID for user payments
      </Text>

      <Card title="Current QR Settings" style={{ marginBottom: 24 }}>
        {currentQR ? (
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div>
              <Text strong>Current QR Code:</Text>
              <div style={{ marginTop: 8 }}>
                <Image
                  src={`${import.meta.env.VITE_API_BASE_URL}/uploads/${currentQR.qrCodeImage}`}
                  alt="Current QR Code"
                  width={200}
                  style={{ border: '1px solid #d9d9d9', borderRadius: 8 }}
                />
              </div>
            </div>
            <div>
              <Space direction="vertical" size="middle">
                <div>
                  <Text strong>UPI ID:</Text>
                  <div style={{ fontSize: 16, color: '#1890ff', fontFamily: 'monospace' }}>
                    {currentQR.upiId}
                  </div>
                </div>
                <div>
                  <Text strong>Last Updated:</Text>
                  <div>{new Date(currentQR.updatedAt).toLocaleString()}</div>
                </div>
                <div>
                  <Text strong>Updated By:</Text>
                  <div>{currentQR.updatedBy?.name || 'Admin'}</div>
                </div>
              </Space>
            </div>
          </div>
        ) : (
          <Text type="secondary">No QR settings configured yet</Text>
        )}
      </Card>

      <Card title="Update QR Settings">
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="upiId"
            label="UPI ID"
            rules={[
              { required: true, message: 'Please enter UPI ID!' },
            ]}
          >
            <Input 
              placeholder="Enter UPI ID (e.g., business@paytm)" 
              size="large"
              style={{ fontFamily: 'monospace' }}
            />
          </Form.Item>

          <Form.Item
            label="QR Code Image"
            extra="Upload new QR code image (optional - leave empty to keep current)"
          >
            <Upload {...uploadProps}>
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload QR Code</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
            >
              Update QR Settings
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default QRManagement;