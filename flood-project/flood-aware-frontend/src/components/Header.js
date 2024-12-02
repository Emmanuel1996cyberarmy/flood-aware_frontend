import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import globeImage from "../assets/images/globe.png"

const Header = () => {
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Clear user ID
        navigate('/'); // Redirect to home
      };
  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto flex justify-between items-center">
      <div style={{
  width: '40px', 
  height: '40px', 
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center', 
  overflow: 'hidden', 
  borderRadius: '50%', 
  backgroundColor: '#f0f0f0'
}}>
  <img 
    src={globeImage} 
    alt="globe" 
    style={{
      width: '100%', 
      height: '100%', 
      objectFit: 'cover'
    }} 
  />
</div>

        <nav className="space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/alerts" className="hover:text-gray-300">Alerts</Link>
          <Link to="/reports" className="hover:text-gray-300">Reports</Link>
          <Link to="/routes" className="hover:text-gray-300">Routes</Link>
          {userId ? (
            <>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">Login</Link>
              <Link to="/register" className="hover:text-gray-300">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
