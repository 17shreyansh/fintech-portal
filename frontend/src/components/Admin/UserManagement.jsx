import { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Typography, message, Card, Form, Input, Row, Col } from 'antd';
import { UserOutlined, EyeOutlined, BankOutlined, EditOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const { Title } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetailModal, setUserDetailModal] = useState(false);
  const [bankEditModal, setBankEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [bankForm] = Form.useForm();
  const [bankLoading, setBankLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await api.get(`/admin/users/${userId}`);
      setUserDetails(response.data);
      setUserDetailModal(true);
    } catch (error) {
      message.error('Failed to fetch user details');
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/toggle-status`);
      message.success('User status updated');
      fetchUsers();
    } catch (error) {
      message.error('Failed to update user status');
    }
  };

  const handleEditBankDetails = (user) => {
    setSelectedUser(user);
    if (user.bankDetails) {
      bankForm.setFieldsValue(user.bankDetails);
    } else {
      bankForm.resetFields();
    }
    setBankEditModal(true);
  };

  const handleBankDetailsUpdate = async (values) => {
    setBankLoading(true);
    try {
      await api.put(`/admin/users/${selectedUser._id}/bank-details`, { bankDetails: values });
      message.success('Bank details updated successfully');
      setBankEditModal(false);
      fetchUserDetails(selectedUser._id);
      fetchUsers();
    } catch (error) {
      message.error('Failed to update bank details');
    } finally {
      setBankLoading(false);
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Wallet Balance',
      dataIndex: 'walletBalance',
      key: 'walletBalance',
      render: (balance) => formatCurrency(balance),
      sorter: (a, b) => a.walletBalance - b.walletBalance,
    },
    {
      title: 'Bank Account',
      dataIndex: 'maskedAccountNumber',
      key: 'bankAccount',
      render: (masked, record) => record.bankDetails ? masked : 'Not Added',
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Active' : 'Suspended'}
        </Tag>
      ),
    },
    {
      title: 'KYC Status',
      dataIndex: 'kyc',
      key: 'kyc',
      render: (kyc) => (
        <Tag color={
          kyc.status === 'approved' ? 'green' : 
          kyc.status === 'pending' ? 'orange' : 'red'
        }>
          {kyc.status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => fetchUserDetails(record._id)}
          >
            View Details
          </Button>
          <Button
            type="link"
            danger={record.isActive}
            onClick={() => toggleUserStatus(record._id)}
          >
            {record.isActive ? 'Suspend' : 'Activate'}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>
        <UserOutlined /> User Management
      </Title>

      <Card loading={loading}>
        <div className="responsive-table">
          <Table
            dataSource={users}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 1000 }}
          />
        </div>
      </Card>

      <Modal
        title="User Details"
        open={userDetailModal}
        onCancel={() => setUserDetailModal(false)}
        footer={null}
        width={800}
      >
        {userDetails && (
          <div>
            <Card title="User Information" style={{ marginBottom: 16 }}>
              <p><strong>Name:</strong> {userDetails.user.name}</p>
              <p><strong>Email:</strong> {userDetails.user.email}</p>
              <p><strong>Wallet Balance:</strong> {formatCurrency(userDetails.user.walletBalance)}</p>
              <p><strong>Status:</strong> 
                <Tag color={userDetails.user.isActive ? 'green' : 'red'} style={{ marginLeft: 8 }}>
                  {userDetails.user.isActive ? 'Active' : 'Suspended'}
                </Tag>
              </p>
            </Card>

            <Card 
              title="Bank Account Details" 
              style={{ marginBottom: 16 }}
              extra={
                <Button 
                  type="primary" 
                  size="small" 
                  icon={<EditOutlined />}
                  onClick={() => handleEditBankDetails(userDetails.user)}
                >
                  Edit Bank Details
                </Button>
              }
            >
              {userDetails.user.bankDetails ? (
                <div>
                  <p><strong>Account Holder:</strong> {userDetails.user.bankDetails.accountHolderName}</p>
                  <p><strong>Account Number:</strong> {userDetails.user.maskedAccountNumber}</p>
                  <p><strong>IFSC Code:</strong> {userDetails.user.bankDetails.ifscCode}</p>
                  <p><strong>Bank Name:</strong> {userDetails.user.bankDetails.bankName}</p>
                  <p><strong>UPI ID:</strong> {userDetails.user.bankDetails.upiId}</p>
                </div>
              ) : (
                <p style={{ color: '#8c8c8c' }}>No bank details added</p>
              )}
            </Card>

            <Card title="Investments" style={{ marginBottom: 16 }}>
              <Table
                dataSource={userDetails.investments}
                columns={[
                  { title: 'Plan', dataIndex: ['plan', 'title'], key: 'plan' },
                  { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => formatCurrency(amount) },
                  { title: 'Status', dataIndex: 'status', key: 'status' },
                  { title: 'Date', dataIndex: 'createdAt', key: 'date', render: (date) => new Date(date).toLocaleDateString() },
                ]}
                pagination={false}
                size="small"
              />
            </Card>

            <Card title="Recent Transactions">
              <Table
                dataSource={userDetails.transactions.slice(0, 5)}
                columns={[
                  { title: 'Type', dataIndex: 'type', key: 'type' },
                  { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (amount) => formatCurrency(amount) },
                  { title: 'Status', dataIndex: 'status', key: 'status' },
                  { title: 'Date', dataIndex: 'createdAt', key: 'date', render: (date) => new Date(date).toLocaleDateString() },
                ]}
                pagination={false}
                size="small"
              />
            </Card>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Bank Details"
        open={bankEditModal}
        onCancel={() => setBankEditModal(false)}
        footer={null}
        width={600}
      >
        <Form
          form={bankForm}
          onFinish={handleBankDetailsUpdate}
          layout="vertical"
        >
          <Form.Item
            name="accountHolderName"
            label="Account Holder Name"
            rules={[{ required: true, message: 'Please enter account holder name' }]}
          >
            <Input placeholder="Enter account holder name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="accountNumber"
                label="Account Number"
                rules={[
                  { required: true, message: 'Please enter account number' },
                  { pattern: /^[0-9]{9,18}$/, message: 'Account number must be 9-18 digits' }
                ]}
              >
                <Input placeholder="Enter account number" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="ifscCode"
                label="IFSC Code"
                rules={[
                  { required: true, message: 'Please enter IFSC code' },
                  { pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/, message: 'Invalid IFSC code format' }
                ]}
              >
                <Input placeholder="Enter IFSC code" style={{ textTransform: 'uppercase' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="bankName"
            label="Bank Name"
            rules={[{ required: true, message: 'Please enter bank name' }]}
          >
            <Input placeholder="Enter bank name" />
          </Form.Item>

          <Form.Item
            name="upiId"
            label="UPI ID"
            rules={[
              { required: true, message: 'Please enter UPI ID' },
              { pattern: /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/, message: 'Invalid UPI ID format' }
            ]}
          >
            <Input placeholder="Enter UPI ID (e.g., user@paytm)" />
          </Form.Item>

          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <Button onClick={() => setBankEditModal(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit" loading={bankLoading}>
                Update Bank Details
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;