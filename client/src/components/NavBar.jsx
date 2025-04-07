import { Link, useLocation } from "react-router-dom";
import React from 'react';
import ConnectWalletButton from './ConnectWalletButton';
import '../styles/design-system.css';
import '../styles/NavBar.css';

const NavBar = ({ account, setAccount }) => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">dX</div>
          <span>dXpense</span>
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/')}`}
          >
            Home
          </Link>
          <Link 
            to="/all-trips" 
            className={`nav-link ${isActive('/all-trips')}`}
          >
            Active Trips
          </Link>
          <ConnectWalletButton setAccount={setAccount} />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
