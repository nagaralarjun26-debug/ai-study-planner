// Navbar: Top navigation bar shown on the dashboard
// Shows the app name, user email, and a logout button

import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  // useCallback memoizes the handler — avoids recreating on each render
  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
      setLoggingOut(false);
    }
  }, [logout]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-icon">🧠</span>
        <span className="navbar-title">AI Study Planner</span>
      </div>

      <div className="navbar-user">
        <span className="navbar-email" title={currentUser?.email || ''}>
          {currentUser?.email}
        </span>
        <button
          id="logout-btn"
          className="btn btn-outline btn-sm"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? 'Logging out…' : 'Logout'}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
