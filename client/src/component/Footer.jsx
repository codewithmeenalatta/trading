import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const Footer = () => {
  // Check user login status dynamically
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('role');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Left Side - Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 mb-2 hover:opacity-80 transition-opacity">
              <Wallet className="h-5 w-5 text-blue-600" />
              <span className="font-bold text-lg text-gray-900">TradePro</span>
            </Link>
            <p className="text-gray-500 text-sm">
              © {currentYear} TradePro Platform. All rights reserved.
            </p>
          </div>

          {/* Right Side - Dynamic Links based on Auth State */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
            {!isLoggedIn ? (
              // Links for Guests (Not Logged In)
              <>
                <Link to="/" className="text-gray-500 hover:text-blue-600 transition-colors">Login</Link>
                <Link to="/register" className="text-gray-500 hover:text-blue-600 transition-colors">Create Account</Link>
                <Link to="#" className="text-gray-500 hover:text-blue-600 transition-colors">How it Works</Link>
              </>
            ) : (
              // Links for Logged In Users
              <>
                {userRole === 'admin' ? (
                  <Link to="/admin" className="text-gray-500 hover:text-blue-600 transition-colors">Admin Panel</Link>
                ) : (
                  <>
                    <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 transition-colors">Dashboard</Link>
                    <Link to="/dashboard" className="text-gray-500 hover:text-blue-600 transition-colors">My Wallet</Link>
                  </>
                )}
                <Link to="#" className="text-gray-500 hover:text-blue-600 transition-colors">Support Ticket</Link>
              </>
            )}
            <Link to="#" className="text-gray-400 hover:text-gray-900 transition-colors">Privacy Policy</Link>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;