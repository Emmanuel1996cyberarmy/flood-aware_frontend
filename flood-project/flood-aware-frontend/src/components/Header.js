import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import globeImage from "../assets/images/globe.png"

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const userId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('userId'); // Clear user ID
        navigate('/'); // Redirect to home
      };
      const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
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

{/* Mobile Hamburger Icon */}
<button
          className="lg:hidden text-white focus:outline-none"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <nav className=" hidden lg:flex space-x-6">
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
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden absolute top-16 left-0 right-0  text-white py-4 px-6 space-y-4 bg-black ">
            <Link to="/" className="block hover:text-gray-300">Home</Link>
            <Link to="/alerts" className="block hover:text-gray-300">Alerts</Link>
            <Link to="/reports" className="block hover:text-gray-300">Reports</Link>
            <Link to="/routes" className="block hover:text-gray-300">Routes</Link>
            {userId ? (
              <>
                <Link to="/profile" className="block hover:text-gray-300">Profile</Link>
                <button
                  onClick={handleLogout}
                  className="block text-red-500 hover:text-red-700 w-full text-left"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block hover:text-gray-300">Login</Link>
                <Link to="/register" className="block hover:text-gray-300">Register</Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
