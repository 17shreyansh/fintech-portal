import { useState, useEffect } from 'react';
import { Table, Button, Tag, Modal, Image, message, Typography, Card, Space, Descriptions } from 'antd';
import { EyeOutlined, CheckOutlined, CloseOutlined, WalletOutlined, BankOutlined } from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const { Title } = Typography;

const TransactionManagement = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [proofModal, setProofModal] = useState(false);
  const [selectedProof, setSelectedProof] = useState('');
  const [userDetailsModal, setUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/transactions/all');
      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTransactionStatus = async (transactionId, status) => {
    try {
      await api.put(`/transactions/${transactionId}/status`, { status });
      message.success(`Transaction ${status} successfully`);
      fetchTransactions();
    } catch (error) {
      message.error(`Failed to ${status} transaction`);
    }
  };

  const viewProof = (proofUrl) => {
    setSelectedProof(`${import.meta.env.VITE_API_BASE_URL}/uploads/${proofUrl}`);
    setProofModal(true);
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setUserDetailsModal(true);
  };

  const columns = [
    {
      title: 'User',
      dataIndex: ['user', 'name'],
      key: 'user',
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 'bold' }}>{name}</div>
          {record.type === 'withdrawal' && (
            <Button 
              type="link" 
              size="small" 
              icon={<BankOutlined />}
              onClick={() => viewUserDetails(record.user)}
              style={{ padding: 0, height: 'auto' }}
            >
              View Bank Details
            </Button>
          )}
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={
          type === 'deposit' ? 'green' : 
          type === 'withdrawal' ? 'red' : 
          type === 'purchase' ? 'blue' : 'orange'
        }>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => formatCurrency(amount),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Proof',
      dataIndex: 'proof',
      key: 'proof',
      render: (proof) => (
        proof ? (
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => viewProof(proof)}
          >
            View Proof
          </Button>
        ) : '-'
      ),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        record.status === 'pending' ? (
          <Space>
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => updateTransactionStatus(record._id, 'approved')}
            >
              Approve
            </Button>
            <Button
              danger
              size="small"
              icon={<CloseOutlined />}
              onClick={() => updateTransactionStatus(record._id, 'rejected')}
            >
              Reject
            </Button>
          </Space>
        ) : (
          <Tag color={record.status === 'approved' ? 'green' : 'red'}>
            {record.status.toUpperCase()}
          </Tag>
        )
      ),
    },
  ];

  const pendingTransactions = transactions.filter(t => t.status === 'pending');
  const allTransactions = transactions;

  return (
    <div>
      <Title level={2}>
        <WalletOutlined /> Transaction Management
      </Title>

      <Card 
        title={`Pending Transactions (${pendingTransactions.length})`} 
        style={{ marginBottom: 24 }}
        loading={loading}
      >
        <div className="responsive-table">
          <Table
            dataSource={pendingTransactions}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 5 }}
            size="small"
            scroll={{ x: 900 }}
          />
        </div>
      </Card>

      <Card title="All Transactions" loading={loading}>
        <div className="responsive-table">
          <Table
            dataSource={allTransactions}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 900 }}
          />
        </div>
      </Card>

      <Modal
        title="Payment Proof"
        open={proofModal}
        onCancel={() => setProofModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center' }}>
          <Image
            src={selectedProof}
            alt="Payment Proof"
            style={{ maxWidth: '100%' }}
          />
        </div>
      </Modal>

      <Modal
        title="User Bank Details"
        open={userDetailsModal}
        onCancel={() => setUserDetailsModal(false)}
        footer={null}
        width={600}
      >
        {selectedUser && (
          <Card>
            <Descriptions column={1} bordered>
              <Descriptions.Item label="User Name">{selectedUser.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
              {selectedUser.bankDetails ? (
                <>
                  <Descriptions.Item label="Account Holder">
                    {selectedUser.bankDetails.accountHolderName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Account Number">
                    {selectedUser.bankDetails.accountNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label="IFSC Code">
                    {selectedUser.bankDetails.ifscCode}
                  </Descriptions.Item>
                  <Descriptions.Item label="Bank Name">
                    {selectedUser.bankDetails.bankName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Branch Name">
                    {selectedUser.bankDetails.branchName}
                  </Descriptions.Item>
                  <Descriptions.Item label="UPI ID">
                    <span style={{ fontFamily: 'monospace', color: '#1890ff' }}>
                      {selectedUser.bankDetails.upiId}
                    </span>
                  </Descriptions.Item>
                </>
              ) : (
                <Descriptions.Item label="Bank Details">
                  <span style={{ color: '#ff4d4f' }}>No bank details available</span>
                </Descriptions.Item>
              )}
            </Descriptions>
          </Card>
        )}
      </Modal>
    </div>
  );
};

export default TransactionManagement;