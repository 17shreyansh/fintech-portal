import { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Button, Drawer, Grid } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  WalletOutlined,
  FundProjectionScreenOutlined,
  HistoryOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined
} from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import Dashboard from '../User/Dashboard';
import InvestmentPlans from '../User/InvestmentPlans';
import Wallet from '../User/Wallet';
import WithdrawalHistory from '../User/WithdrawalHistory';
import Support from '../User/Support';
import Settings from '../User/Settings';

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const UserLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();

  const isMobile = !screens.md;
  const isTablet = screens.md && !screens.lg;

  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else if (isTablet) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile, isTablet]);

  const menuItems = [
    { key: '/dashboard', icon: <DashboardOutlined />, label: 'Dashboard' },
    { key: '/plans', icon: <FundProjectionScreenOutlined />, label: 'Investment Plans' },
    { key: '/wallet', icon: <WalletOutlined />, label: 'Wallet' },
    { key: '/withdrawals', icon: <HistoryOutlined />, label: 'Withdrawals' },
    { key: '/support', icon: <QuestionCircleOutlined />, label: 'Support' },
    { key: '/settings', icon: <SettingOutlined />, label: 'Settings' },
  ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: logout,
    },
  ];

  const handleMenuClick = ({ key }) => {
    navigate(key);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const renderMobileLayout = () => (
    <Layout className="mobile-layout">
      <Header className="mobile-header">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileDrawerOpen(true)}
          size="large"
        />
        <div className="mobile-brand">FinTech</div>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Avatar size="small" icon={<UserOutlined />} />
        </Dropdown>
      </Header>
      
      <Drawer
        title={<div style={{ color: 'white', fontWeight: 'bold' }}>FinTech Portal</div>}
        placement="left"
        onClose={() => setMobileDrawerOpen(false)}
        open={mobileDrawerOpen}
        styles={{ body: { padding: 0 }, header: { background: '#001529' } }}
        width={280}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none', height: '100%' }}
        />
      </Drawer>
      
      <Content className="mobile-content">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/plans" element={<InvestmentPlans />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/withdrawals" element={<WithdrawalHistory />} />
          <Route path="/support" element={<Support />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </Content>
    </Layout>
  );

  const renderDesktopLayout = () => (
    <Layout className="desktop-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={240}
        collapsedWidth={80}
        className="desktop-sider"
      >
        <div className="sider-logo">
          {collapsed ? 'FT' : 'FinTech Portal'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      
      <Layout className="desktop-main">
        <Header className="desktop-header">
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            size="large"
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space className="user-info">
              <Avatar icon={<UserOutlined />} />
              <span>{user?.name}</span>
            </Space>
          </Dropdown>
        </Header>
        
        <Content className="desktop-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/plans" element={<InvestmentPlans />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/withdrawals" element={<WithdrawalHistory />} />
            <Route path="/support" element={<Support />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/" element={<Dashboard />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );

  return isMobile ? renderMobileLayout() : renderDesktopLayout();
};

export default UserLayout;