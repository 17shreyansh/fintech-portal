import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './components/Public/LandingPage';
import PublicInvestmentPlans from './components/Public/PublicInvestmentPlans';
import AboutUs from './components/Public/AboutUs';
import ContactUs from './components/Public/ContactUs';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';
import UserLayout from './components/Layout/UserLayout';
import AdminLayout from './components/Layout/AdminLayout';
import './App.css';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  
  return children;
};

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#d4af37',
          colorPrimaryHover: '#b8941f',
          colorLink: '#d4af37',
          borderRadius: 8,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        },
        components: {
          Layout: {
            bodyBg: '#ffffff',
          },
          Card: {
            borderRadiusLG: 12,
            boxShadowTertiary: '0 4px 20px rgba(0,0,0,0.08)',
          },
          Button: {
            borderRadiusLG: 8,
            fontWeight: 500,
          },
          Input: {
            borderRadiusLG: 8,
          },
        },
      }}
    >
      <AntApp>
        <AuthProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/investment-plans" element={<PublicInvestmentPlans />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
              {/* Protected Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute adminOnly>
                  <AdminLayout />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/*" element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
          <Toaster position="top-right" />
        </AuthProvider>
      </AntApp>
    </ConfigProvider>
  );
}

export default App;