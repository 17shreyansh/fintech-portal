import { Button } from 'antd';
import { Link } from 'react-router-dom';
import { DollarOutlined, HomeOutlined } from '@ant-design/icons';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="public-navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <DollarOutlined className="logo-icon" />
            <span className="logo-text">Adhani Investment Group</span>
          </Link>
          <nav className="nav-menu">
            <Link to="/" className="nav-link">
              <HomeOutlined /> Home
            </Link>
            <Link to="/investment-plans" className="nav-link">Investment Plans</Link>
            <Link to="/about" className="nav-link">About Us</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/login">
              <Button type="primary" className="login-btn">Login</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;