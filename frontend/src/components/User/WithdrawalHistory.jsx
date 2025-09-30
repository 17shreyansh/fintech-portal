import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  message, 
  Typography, 
  Tag, 
  Space,
  Statistic,
  Row,
  Col,
  Spin,
  Empty,
  Alert
} from 'antd';
import { 
  MinusOutlined, 
  HistoryOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const { Title, Text } = Typography;

const WithdrawalHistory = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, dashboardRes] = await Promise.all([
        api.get('/transactions/history'),
        api.get('/user/dashboard')
      ]);
      const withdrawalData = transactionsRes.data.filter(t => t.type === 'withdrawal');
      setWithdrawals(withdrawalData);
      setWalletBalance(dashboardRes.data.walletBalance);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (values) => {
    setSubmitLoading(true);
    try {
      await api.post('/transactions/withdraw', values);
      message.success('Withdrawal request submitted successfully! 🎉');
      setWithdrawModal(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      message.error(error.response?.data?.message || 'Withdrawal request failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircleOutlined />;
      case 'pending':
        return <ClockCircleOutlined />;
      case 'rejected':
        return <ExclamationCircleOutlined />;
      default:
        return null;
    }
  };

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => (
        <Text strong style={{ fontSize: '16px', color: '#f5222d' }}>
          {formatCurrency(amount)}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag 
          color={status === 'approved' ? 'green' : status === 'pending' ? 'orange' : 'red'}
          icon={getStatusIcon(status)}
          style={{ fontWeight: 'bold', padding: '4px 12px' }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Request Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Processing Time',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (date, record) => {
        if (record.status === 'pending') return '-';
        return new Date(date).toLocaleDateString();
      },
    },
  ];

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'approved')
    .reduce((sum, w) => sum + w.amount, 0);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="withdrawal-container">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#262626', marginBottom: 8 }}>
          <HistoryOutlined /> Withdrawal History
        </Title>
        <Text style={{ fontSize: 16, color: '#8c8c8c' }}>
          Request withdrawals and track their status
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Available Balance"
              value={walletBalance}
              formatter={(value) => formatCurrency(value)}
              prefix={<span style={{ color: '#52c41a', fontSize: '20px' }}>₹</span>}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Total Withdrawn"
              value={totalWithdrawn}
              formatter={(value) => formatCurrency(value)}
              prefix={<CheckCircleOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card className="stat-card">
            <Statistic
              title="Pending Requests"
              value={pendingWithdrawals.length}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      {pendingWithdrawals.length > 0 && (
        <Alert
          message="Pending Withdrawals"
          description={`You have ${pendingWithdrawals.length} withdrawal request(s) being processed. Processing time is typically 1-3 business days.`}
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <HistoryOutlined />
                <span>All Withdrawal Requests</span>
                <Tag color="blue">{withdrawals.length} Records</Tag>
              </Space>
            }
            className="table-card"
          >
            <div className="responsive-table">
              <Table
                dataSource={withdrawals}
                columns={columns}
                rowKey="_id"
                pagination={{ 
                  pageSize: 8,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} withdrawals`
                }}
                scroll={{ x: 600 }}
                locale={{ emptyText: <Empty description="No withdrawal requests yet" /> }}
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card 
            title="Request Withdrawal"
            className="action-card"
            extra={<MinusOutlined style={{ color: '#f5222d' }} />}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '48px', color: '#f5222d', marginBottom: '16px' }}>₹</span>
                <Text style={{ display: 'block', fontSize: '16px', color: '#8c8c8c' }}>
                  Withdraw funds from your wallet securely
                </Text>
              </div>
              
              <Button 
                type="primary" 
                danger
                size="large"
                icon={<MinusOutlined />}
                onClick={() => setWithdrawModal(true)}
                style={{ width: '100%', height: '48px', fontWeight: 'bold' }}
                disabled={walletBalance <= 0}
              >
                Request Withdrawal
              </Button>
              
              <div style={{ fontSize: '12px', color: '#8c8c8c', textAlign: 'center' }}>
                • Minimum withdrawal: ₹500<br/>
                • Processing time: 1-3 business days<br/>
                • No withdrawal fees
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      <Modal
        title={
          <Space>
            <MinusOutlined />
            <span>Request Withdrawal</span>
          </Space>
        }
        open={withdrawModal}
        onCancel={() => {
          setWithdrawModal(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
        destroyOnClose={true}
      >
        <div style={{ marginTop: 20 }}>
          <Alert
            message={`Available Balance: ${formatCurrency(walletBalance)}`}
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
          />
          
          <Form form={form} onFinish={handleWithdraw} layout="vertical">
            <Form.Item
              name="amount"
              label="Withdrawal Amount (₹)"
              rules={[
                { required: true, message: 'Please enter amount' },
                {
                  validator: (_, value) => {
                    const numValue = Number(value);
                    if (!value) {
                      return Promise.reject('Please enter amount');
                    }
                    if (isNaN(numValue) || numValue <= 0) {
                      return Promise.reject('Please enter a valid amount');
                    }
                    if (numValue < 500) {
                      return Promise.reject('Minimum withdrawal is ₹500');
                    }
                    if (numValue > walletBalance) {
                      return Promise.reject('Amount exceeds available balance');
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input 
                type="number" 
                prefix={<span style={{ color: '#1890ff' }}>₹</span>}
                placeholder="Enter withdrawal amount (e.g., 5000)"
                size="large"
                style={{ fontSize: '16px' }}
                min={500}
                max={walletBalance}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button 
                type="primary" 
                htmlType="submit" 
                size="large"
                loading={submitLoading}
                style={{ width: '100%', height: '48px', fontWeight: 'bold' }}
              >
                Submit Withdrawal Request
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default WithdrawalHistory;