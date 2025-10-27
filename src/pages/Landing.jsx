import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Navigation */}
      <nav className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">L</span>
              </div>
              <span className="text-white text-xl font-bold">Legendor</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-white hover:text-blue-200 transition-colors">Features</a>
              <a href="#about" className="text-white hover:text-blue-200 transition-colors">About</a>
              <a href="#contact" className="text-white hover:text-blue-200 transition-colors">Contact</a>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className="text-white hover:text-blue-200 transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center text-white max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Connect with{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Legends
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Join the ultimate sports community where athletes, fans, and enthusiasts 
            come together to share their legendary moments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/signup" 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105 shadow-2xl"
            >
              Start Your Journey
            </Link>
            <Link 
              to="/login" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:bg-opacity-10 transition-all"
            >
              Explore Community
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Legendor?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of sports social networking
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
                🏀
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Sports Focused</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with athletes and sports enthusiasts who share your passion 
                for the game. From basketball to football, we've got you covered.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
                💬
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real Connections</h3>
              <p className="text-gray-600 leading-relaxed">
                Build meaningful relationships with like-minded individuals. 
                Share experiences, tips, and grow together in your sports journey.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
              <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center text-white text-2xl mb-6">
                🚀
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Grow Together</h3>
              <p className="text-gray-600 leading-relaxed">
                Track your progress, share achievements, and get inspired by 
                the success stories of fellow sports enthusiasts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Become a Legend?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of sports enthusiasts who are already sharing their 
            legendary moments and building lasting connections.
          </p>
          <Link 
            to="/signup" 
            className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all transform hover:scale-105 shadow-2xl inline-block"
          >
            Join Now - It's Free!
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-600 font-bold">L</span>
              </div>
              <span className="text-xl font-bold">Legendor</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting sports enthusiasts worldwide
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Legendor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
