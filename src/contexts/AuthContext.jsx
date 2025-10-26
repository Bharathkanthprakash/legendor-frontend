import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      // Verify token with backend
      setUser({ id: '1', username: 'user' }); // Temporary mock user
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // Login logic here
    setUser({ id: '1', username: 'user' });
  };

  const signup = async (userData) => {
    // Signup logic here
    setUser({ id: '1', username: userData.username });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
