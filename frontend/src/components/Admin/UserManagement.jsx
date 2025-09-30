import { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Typography, message, Card } from 'antd';
import { UserOutlined, EyeOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const { Title } = Typography;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userDetailModal, setUserDetailModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);

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
    </div>
  );
};

export default UserManagement;