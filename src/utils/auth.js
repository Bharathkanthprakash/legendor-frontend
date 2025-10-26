// Authentication utility functions

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('User logged out successfully');
};

// Store token and user data
export const setAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
  console.log('Auth data stored for user:', user.email);
};

// Get user data from localStorage
export const getUser = () => {
  const userStr = localStorage.getItem('user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing user data:', error);
    return null;
  }
};

// Check if token is expired (basic check)
export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;
  
  try {
    // Simple check - in real app, you'd decode JWT and check expiry
    return false;
  } catch (error) {
    return true;
  }
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('auth_time');
};