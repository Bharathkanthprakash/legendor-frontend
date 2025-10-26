// src/components/layout/Layout.jsx
import React from 'react';
import Navbar from '../Navbar';
import { useNotification } from '../../contexts/NotificationContext';

const Layout = ({ children }) => {
  const { notification } = useNotification();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          notification.type === 'error' ? 'bg-red-500' : 
          notification.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        } text-white`}>
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default Layout;
