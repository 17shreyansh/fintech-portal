import { useState, useEffect } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Upload, 

  Typography, 
  Tag, 
  Space,
  Statistic,
  Row,
  Col,
  Spin,
  Empty
} from 'antd';
import { 
  PlusOutlined, 
  UploadOutlined, 
  WalletOutlined,
  HistoryOutlined,
  CreditCardOutlined,
  FundProjectionScreenOutlined
} from '@ant-design/icons';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

const { Title, Text } = Typography;

const Wallet = () => {
  const [transactions, setTransactions] = useState([]);
  const [walletBalance, setWalletBalance] = useState(0);
  const [walletData, setWalletData] = useState({
    balance: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
    totalInvested: 0,
    totalReturns: 0
  });
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [depositModal, setDepositModal] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [transactionsRes, dashboardRes, investmentsRes] = await Promise.all([
        api.get('/transactions/history'),
        api.get('/user/dashboard'),
        api.get('/user/investments')
      ]);
      setTransactions(transactionsRes.data);
      setWalletBalance(dashboardRes.data.walletBalance);
      
      // Calculate wallet statistics
      const txns = transactionsRes.data;
      const investments = investmentsRes.data || [];
      
      const totalDeposited = txns.filter(t => t.type === 'deposit' && t.status === 'approved')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalWithdrawn = txns.filter(t => t.type === 'withdrawal' && t.status === 'approved')
        .reduce((sum, t) => sum + t.amount, 0);
      const totalInvested = investments.reduce((sum, inv) => sum + (inv.investedAmount || inv.amount || 0), 0);
      const totalReturns = txns.filter(t => t.type === 'return')
        .reduce((sum, t) => sum + t.amount, 0);
      
      setWalletData({
        balance: dashboardRes.data.walletBalance,
        totalDeposited,
        totalWithdrawn,
        totalInvested,
        totalReturns
      });
      
      setInvestments(investments);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = async (values) => {
    const formData = new FormData();
    formData.append('amount', values.amount);
    if (values.proof && values.proof.fileList && values.proof.fileList[0]) {
      formData.append('proof', values.proof.fileList[0].originFileObj);
    }

    try {
      await api.post('/transactions/deposit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Deposit request submitted successfully! 🎉');
      setDepositModal(false);
      form.resetFields();
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Deposit request failed');
    }
  };

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag 
          color={
            type === 'deposit' ? 'green' : 
            type === 'withdrawal' ? 'red' : 
            type === 'purchase' ? 'blue' : 'orange'
          }
          style={{ fontWeight: 'bold' }}
        >
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text 
          strong
          style={{ 
            color: record.type === 'deposit' || record.type === 'return' ? '#52c41a' : '#f5222d',
            fontSize: '14px'
          }}
        >
          {record.type === 'deposit' || record.type === 'return' ? '+' : '-'}{formatCurrency(amount)}
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
          style={{ fontWeight: 'bold' }}
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (desc, record) => {
        if (record.plan) return `Investment in ${record.plan.title}`;
        return desc || '-';
      },
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="wallet-container">
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#262626', marginBottom: 8 }}>
          <WalletOutlined /> My Wallet
        </Title>
        <Text style={{ fontSize: 16, color: '#8c8c8c' }}>
          Manage your funds and track all transactions
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Available Balance"
              value={walletData.balance}
              formatter={(value) => formatCurrency(value)}
              prefix={<WalletOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Deposited"
              value={walletData.totalDeposited}
              formatter={(value) => formatCurrency(value)}
              prefix={<PlusOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Invested"
              value={walletData.totalInvested}
              formatter={(value) => formatCurrency(value)}
              prefix={<FundProjectionScreenOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Returns"
              value={walletData.totalReturns}
              formatter={(value) => formatCurrency(value)}
              prefix={<HistoryOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12}>
          <Card>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setDepositModal(true)}
              style={{ width: '100%', height: '48px', fontWeight: 'bold' }}
            >
              Add Funds
            </Button>
          </Card>
        </Col>
        <Col xs={24} sm={12}>
          <Card>
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <CreditCardOutlined style={{ fontSize: '24px', color: '#1890ff', marginBottom: '8px' }} />
              <div>
                <Text strong>Secure Payments</Text>
                <div style={{ color: '#8c8c8c', fontSize: '12px' }}>Bank-grade security</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {investments.length > 0 && (
        <Card 
          title={
            <Space>
              <FundProjectionScreenOutlined />
              <span>My Investments</span>
              <Tag color="purple">{investments.length} Active</Tag>
            </Space>
          }
          style={{ marginBottom: 24 }}
        >
          <Row gutter={[16, 16]}>
            {investments.map((investment) => (
              <Col xs={24} sm={12} lg={8} key={investment._id}>
                <Card 
                  size="small"
                  style={{ 
                    background: 'linear-gradient(135deg, #f6ffed 0%, #e6f7ff 100%)',
                    border: '1px solid #b7eb8f'
                  }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {investment.plan?.category?.icon} {investment.plan?.title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      Purchased: {new Date(investment.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Invested:</span>
                      <span style={{ fontWeight: 'bold', color: '#1890ff' }}>
                        {formatCurrency(investment.investedAmount)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Expected Return:</span>
                      <span style={{ fontWeight: 'bold', color: '#52c41a' }}>
                        +{formatCurrency(investment.expectedReturn)}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Maturity:</span>
                      <span style={{ fontWeight: 'bold' }}>
                        {new Date(investment.maturityDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '8px', background: '#fff', borderRadius: '4px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#389e0d' }}>
                      Total Maturity: {formatCurrency(investment.investedAmount + investment.expectedReturn)}
                    </div>
                    <Tag color={investment.status === 'active' ? 'green' : 'blue'} style={{ marginTop: 4 }}>
                      {investment.status.toUpperCase()}
                    </Tag>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </Card>
      )}
      
      <Card 
        title={
          <Space>
            <HistoryOutlined />
            <span>Transaction History</span>
            <Tag color="blue">{transactions.length} Records</Tag>
          </Space>
        }
        className="transactions-card"
      >
        <div className="responsive-table">
          <Table
            dataSource={transactions}
            columns={columns}
            rowKey="_id"
            pagination={{ 
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total) => `Total ${total} transactions`
            }}
            scroll={{ x: 800 }}
            locale={{ emptyText: <Empty description="No transactions yet" /> }}
          />
        </div>
      </Card>

      <Modal
        title={
          <Space>
            <PlusOutlined />
            <span>Add Funds to Wallet</span>
          </Space>
        }
        open={depositModal}
        onCancel={() => {
          setDepositModal(false);
          form.resetFields();
        }}
        footer={null}
        width={500}
        destroyOnClose={true}
      >
        <Form form={form} onFinish={handleDeposit} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="amount"
            label="Deposit Amount (₹)"
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
                  if (numValue < 100) {
                    return Promise.reject('Minimum deposit amount is ₹100');
                  }
                  if (numValue > 10000000) {
                    return Promise.reject('Maximum deposit amount is ₹1,00,00,000');
                  }
                  return Promise.resolve();
                }
              }
            ]}
          >
            <Input 
              type="number" 
              prefix={<span style={{ color: '#1890ff' }}>₹</span>}
              placeholder="Enter amount (e.g., 5000)"
              size="large"
              style={{ fontSize: '16px' }}
              min={100}
              max={10000000}
            />
          </Form.Item>

          <Form.Item
            name="proof"
            label="Payment Proof"
            rules={[
              { required: true, message: 'Please upload payment proof' },
              {
                validator: (_, value) => {
                  if (!value || !value.fileList || value.fileList.length === 0) {
                    return Promise.reject('Please upload payment proof');
                  }
                  const file = value.fileList[0];
                  if (file.size > 5 * 1024 * 1024) { // 5MB limit
                    return Promise.reject('File size must be less than 5MB');
                  }
                  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                  if (!allowedTypes.includes(file.type)) {
                    return Promise.reject('Only image files (JPEG, PNG, GIF) are allowed');
                  }
                  return Promise.resolve();
                }
              }
            ]}
            extra="Upload QR code screenshot or payment receipt (Max 5MB, JPG/PNG/GIF)"
          >
            <Upload
              beforeUpload={() => false}
              maxCount={1}
              accept="image/*"
              listType="picture-card"
              onChange={(info) => {
                // Trigger form validation when file changes
                form.setFieldsValue({ proof: info });
              }}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload Proof</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              style={{ width: '100%', height: '48px', fontWeight: 'bold' }}
            >
              Submit Deposit Request
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Wallet;