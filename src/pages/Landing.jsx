import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="hero-section">
        <div className="container">
          <h1 className="hero-title">Legendor</h1>
          <p className="hero-subtitle">
            The Professional Network for the Sports Ecosystem
          </p>
          <p className="hero-description">
            Connect athletes, coaches, physiotherapists, managers, sponsors, and brands. 
            Share achievements, get discovered, and collaborate in the world of sports.
          </p>
          
          <div className="cta-buttons">
            <button 
              onClick={() => navigate('/signup')}
              className="btn btn-primary"
            >
              Join Now
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn btn-secondary"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Join Legendor?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>🏆 For Athletes</h3>
              <p>Showcase your achievements, connect with coaches and sponsors</p>
            </div>
            <div className="feature-card">
              <h3>👥 For Coaches</h3>
              <p>Discover talent, share training methodologies, build your network</p>
            </div>
            <div className="feature-card">
              <h3>🤝 For Professionals</h3>
              <p>Connect with sports organizations, find career opportunities</p>
            </div>
            <div className="feature-card">
              <h3>🏢 For Organizations</h3>
              <p>Find talent, build your brand, connect with the sports community</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;