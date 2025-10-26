import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://legendor-backend.onrender.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),
  login: (credentials) => api.post('/api/auth/login', credentials),
  getMe: () => api.get('/api/auth/me'),
  updateProfile: (profileData) => api.put('/api/auth/profile', profileData),
  refreshToken: (refreshToken) => api.post('/api/auth/refresh-token', { refreshToken }),
};

// Posts API
export const postsAPI = {
  getPosts: () => api.get('/api/posts'),
  getFeed: (page = 1, limit = 10) => api.get(`/api/posts/feed?page=${page}&limit=${limit}`),
  getUserPosts: (userId) => api.get(`/api/posts/user/${userId}`),
  getPost: (postId) => api.get(`/api/posts/${postId}`),
  createPost: (postData) => api.post('/api/posts', postData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deletePost: (postId) => api.delete(`/api/posts/${postId}`),
  searchPosts: (query, filters = {}) => api.get('/api/posts/search', { params: { q: query, ...filters } }),
  savePost: (postId) => api.post(`/api/posts/${postId}/save`),
  unsavePost: (postId) => api.delete(`/api/posts/${postId}/save`),
};

// Profiles API
export const profilesAPI = {
  getProfile: (userId) => api.get(`/api/profiles/${userId}`),
  updateProfile: (profileData) => api.put('/api/profiles', profileData),
  uploadProfilePicture: (formData) => api.put('/api/profiles/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  uploadCoverPhoto: (formData) => api.put('/api/profiles/cover', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  follow: (userId) => api.post(`/api/profiles/${userId}/follow`),
  unfollow: (userId) => api.delete(`/api/profiles/${userId}/follow`),
  getFollowers: (userId) => api.get(`/api/profiles/${userId}/followers`),
  getFollowing: (userId) => api.get(`/api/profiles/${userId}/following`),
  searchUsers: (query) => api.get(`/api/profiles/search?q=${query}`),
};

// Engagement API
export const engagementAPI = {
  likePost: (postId) => api.post(`/api/posts/${postId}/like`),
  unlikePost: (postId) => api.delete(`/api/posts/${postId}/like`),
  getLikes: (postId) => api.get(`/api/posts/${postId}/likes`),
  addComment: (postId, text) => api.post(`/api/posts/${postId}/comments`, { text }),
  getComments: (postId) => api.get(`/api/posts/${postId}/comments`),
  deleteComment: (commentId) => api.delete(`/api/posts/comments/${commentId}`),
  sharePost: (shareData) => api.post('/api/shares', shareData),
};

// Stories API
export const storiesAPI = {
  createStory: (storyData) => api.post('/api/stories', storyData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getFeed: () => api.get('/api/stories/feed'),
  viewStory: (storyId) => api.post(`/api/stories/${storyId}/view`),
  deleteStory: (storyId) => api.delete(`/api/stories/${storyId}`),
};

// Messages API
export const messagesAPI = {
  getConversations: () => api.get('/api/messages/conversations'),
  getMessages: (conversationId) => api.get(`/api/messages/conversations/${conversationId}/messages`),
  sendMessage: (messageData) => api.post('/api/messages/send', messageData),
  createConversation: (participantIds) => api.post('/api/messages/conversations', { participants: participantIds }),
  markAsRead: (conversationId) => api.put(`/api/messages/conversations/${conversationId}/read`),
};

// Notifications API
export const notificationsAPI = {
  getNotifications: () => api.get('/api/notifications'),
  markAsRead: (notificationId) => api.put(`/api/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/api/notifications/read-all'),
  getUnreadCount: () => api.get('/api/notifications/unread-count'),
};

// Explore API
export const exploreAPI = {
  getTrendingPosts: () => api.get('/api/explore/trending'),
  getSuggestedUsers: () => api.get('/api/explore/suggested-users'),
  getPopularSports: () => api.get('/api/explore/popular-sports'),
};

export default api;
