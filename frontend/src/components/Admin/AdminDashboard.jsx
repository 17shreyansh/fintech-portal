import { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Typography } from 'antd';
import { 
  UserOutlined, 
  FundProjectionScreenOutlined, 
  WalletOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import { Pie } from '@ant-design/charts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/currency';

const { Title } = Typography;

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalInvestments: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    openTickets: 0,
    totalInvestedAmount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { type: 'Active Investments', value: stats.totalInvestments },
    { type: 'Pending Deposits', value: stats.pendingDeposits },
    { type: 'Pending Withdrawals', value: stats.pendingWithdrawals },
    { type: 'Open Tickets', value: stats.openTickets },
  ];

  const config = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Investments"
              value={stats.totalInvestments}
              prefix={<FundProjectionScreenOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Total Invested Amount"
              value={stats.totalInvestedAmount}
              formatter={(value) => formatCurrency(value)}
              prefix={<WalletOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Pending Deposits"
              value={stats.pendingDeposits}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Pending Withdrawals"
              value={stats.pendingWithdrawals}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="Open Tickets"
              value={stats.openTickets}
              prefix={<QuestionCircleOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="System Overview" loading={loading}>
            <div style={{ height: '300px', overflow: 'hidden' }}>
              <Pie {...config} height={250} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Quick Actions" loading={loading}>
            <div style={{ padding: '20px 0' }}>
              <p>• Review pending deposits and withdrawals</p>
              <p>• Manage investment plans and categories</p>
              <p>• Monitor user activities and support tickets</p>
              <p>• Analyze system performance and metrics</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;