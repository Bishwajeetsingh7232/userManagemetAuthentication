import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        User Access Management
      </Link>
      
      <div className="nav-links">
        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className="nav-link">
              Dashboard
            </Link>
            <Link to="/software" className="nav-link">
              Software
            </Link>
          </>
        )}
        
        {user?.role === 'manager' && (
          <Link to="/manage-requests" className="nav-link">
            Manage Requests
          </Link>
        )}
        
        {user?.role === 'employee' && (
          <Link to="/request-access" className="nav-link">
            Request Access
          </Link>
        )}
        
        <button onClick={handleLogout} className="nav-link btn-link">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 