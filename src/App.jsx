import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import Explore from './pages/Explore';
import Stories from './pages/Stories';
import PostDetail from './pages/PostDetail';
import Settings from './pages/Settings';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return !user ? children : <Navigate to="/feed" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <NotificationProvider>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/signup" 
                  element={
                    <PublicRoute>
                      <Signup />
                    </PublicRoute>
                  } 
                />

                {/* Protected Routes with Layout */}
                <Route 
                  path="/feed" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Feed />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile/:userId?" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Profile />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/messages" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Messages />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/notifications" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Notifications />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/explore" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Explore />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/stories" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Stories />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/post/:postId" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <PostDetail />
                      </Layout>
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </PrivateRoute>
                  } 
                />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/feed" />} />
              </Routes>
            </div>
          </NotificationProvider>
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
