import axios from 'axios';

// Use your actual Render backend URL
const API_BASE_URL = 'https://legendor-backend.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - clear auth data and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getMe: () => api.get('/api/auth/me'),
  sendVerification: () => api.post('/api/auth/send-verification'),
  verifyEmail: (token) => api.get(`/api/auth/verify-email/${token}`),
};

// Posts API endpoints
export const postsAPI = {
  getPosts: () => api.get('/api/posts'),
  createPost: (postData) => api.post('/api/posts', postData),
  deletePost: (postId) => api.delete(`/api/posts/${postId}`),
  getUserPosts: (userId) => api.get(`/api/posts/user/${userId}`),
};

// Profiles API endpoints
export const profilesAPI = {
  getProfile: (userId) => api.get(`/api/profiles/${userId}`),
  updateProfile: (profileData) => api.put('/api/profiles', profileData),
  uploadProfilePicture: (formData) => api.put('/api/profiles/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
};

// Engagement API endpoints
export const engagementAPI = {
  likePost: (postId) => api.post(`/api/posts/${postId}/like`),
  unlikePost: (postId) => api.delete(`/api/posts/${postId}/like`),
  getLikes: (postId) => api.get(`/api/posts/${postId}/likes`),
  addComment: (postId, text) => api.post(`/api/posts/${postId}/comments`, { text }),
  getComments: (postId) => api.get(`/api/posts/${postId}/comments`),
  deleteComment: (commentId) => api.delete(`/api/posts/comments/${commentId}`),
  sharePost: (shareData) => api.post('/api/shares', shareData),
};

export default api;