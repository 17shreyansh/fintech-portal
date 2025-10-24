import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Tag, Typography, Spin, Empty, Progress, Divider, Space, Button } from 'antd';
import { WalletOutlined, FundProjectionScreenOutlined, HistoryOutlined, TrophyOutlined, CalendarOutlined, DollarOutlined, RiseOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';
import toast from 'react-hot-toast';

const { Title } = Typography;

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    walletBalance: 0,
    totalInvested: 0,
    activeInvestments: 0,
    investments: [],
    recentTransactions: []
  });
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, investmentsRes] = await Promise.all([
        api.get('/user/dashboard'),
        api.get('/user/investments')
      ]);
      setDashboardData(dashboardRes.data);
      setInvestments(investmentsRes.data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const investmentColumns = [
    {
      title: 'Plan Details',
      key: 'plan',
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 'bold', color: '#262626' }}>
            {record.plan?.category?.icon} {record.plan?.title}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.plan?.description}
          </div>
        </div>
      ),
    },
    {
      title: 'Investment',
      dataIndex: 'investedAmount',
      key: 'investedAmount',
      render: (amount) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold', color: '#1890ff' }}>
            {formatCurrency(amount)}
          </div>
        </div>
      ),
    },
    {
      title: 'Expected Return',
      dataIndex: 'expectedReturn',
      key: 'expectedReturn',
      render: (returns) => (
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold', color: '#52c41a' }}>
            +{formatCurrency(returns)}
          </div>
        </div>
      ),
    },
    {
      title: 'Maturity Date',
      dataIndex: 'maturityDate',
      key: 'maturityDate',
      render: (date) => (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: 'bold' }}>
            {new Date(date).toLocaleDateString()}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24))} days left
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : status === 'matured' ? 'blue' : 'orange'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const transactionColumns = [
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
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const investmentData = dashboardData.investments.map((inv, index) => ({
    month: `Plan ${index + 1}`,
    value: inv.investedAmount || inv.amount,
  }));



  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Title level={2} style={{ marginBottom: 24, color: '#262626' }}>
        <TrophyOutlined style={{ color: '#ffd700', marginRight: 8 }} />
        Investment Dashboard
      </Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Wallet Balance"
              value={dashboardData.walletBalance}
              formatter={(value) => formatCurrency(value)}
              prefix={<WalletOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Total Invested"
              value={dashboardData.totalInvested}
              formatter={(value) => formatCurrency(value)}
              prefix={<FundProjectionScreenOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Active Investments"
              value={dashboardData.activeInvestments}
              prefix={<TrophyOutlined style={{ color: '#722ed1' }} />}
              valueStyle={{ color: '#722ed1', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="stat-card">
            <Statistic
              title="Expected Returns"
              value={dashboardData.investments
                .filter(inv => inv.status === 'active')
                .reduce((sum, inv) => sum + (inv.expectedReturn || 0), 0)
              }
              formatter={(value) => formatCurrency(value)}
              prefix={<HistoryOutlined style={{ color: '#fa8c16' }} />}
              valueStyle={{ color: '#fa8c16', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <FundProjectionScreenOutlined />
                <span>My Investment Portfolio</span>
                <Tag color="blue">{investments.length} Active Plans</Tag>
              </Space>
            }
            extra={
              <Button type="primary" onClick={() => window.location.href = '/plans'}>
                Invest More
              </Button>
            }
          >
            {investments.length > 0 ? (
              <Table
                dataSource={investments}
                columns={investmentColumns}
                rowKey="_id"
                pagination={{ pageSize: 5 }}
                scroll={{ x: 800 }}
              />
            ) : (
              <Empty 
                description="No investments yet" 
                style={{ padding: '60px 0' }}
              >
                <Link to="/dashboard/plans">
                  <Button type="primary">
                    Start Investing
                    </Button>
                </Link>
              </Empty>
            )}
          </Card>
        </Col>
      </Row>
      
      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card 
            title={
              <Space>
                <HistoryOutlined />
                <span>Recent Transactions</span>
                <Tag color="green">Latest Activity</Tag>
              </Space>
            }
          >
            <Table
              dataSource={dashboardData.recentTransactions}
              columns={transactionColumns}
              pagination={{ pageSize: 5 }}
              size="small"
              rowKey="_id"
              scroll={{ x: 600 }}
              locale={{ emptyText: <Empty description="No transactions yet" /> }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;