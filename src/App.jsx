import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated } from './utils/auth';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Feed from './pages/Feed';
// Remove this import since we're removing the upload page
// import PostUpload from './pages/PostUpload'; 
import Navbar from './components/Navbar';
import './assets/styles.css';

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/dashboard" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/feed" 
              element={
                <PrivateRoute>
                  <Feed />
                </PrivateRoute>
              } 
            />
            {/* REMOVE the upload route completely */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;