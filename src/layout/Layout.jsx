// src/components/layout/Layout.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  return (
    <div className="layout">
      {/* Header/Navigation can be added here */}
      <main className="main-content">
        {children}
      </main>
      {/* Footer can be added here */}
    </div>
  );
};

export default Layout;
