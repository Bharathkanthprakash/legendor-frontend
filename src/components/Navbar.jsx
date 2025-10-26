// src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Legendor
          </Link>
          
          <div className="flex space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
