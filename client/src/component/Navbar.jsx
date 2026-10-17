import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';
import { LogOut, User as UserIcon, LayoutDashboard, Wallet } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const navigate = useNavigate();
  
  // Check kar rahe hain ki user ke pas token/role hai ya nahi
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('role');

  const handleLogout = async () => {
    try {
        await api.post('/auth/logout');
        localStorage.clear();
        toast.success("Logged out successfully");
        navigate("/");
    } catch (error) {
        console.log("Logout error:" , error);
        toast.error("Logout karne me kuch dikkat aayi");
    }
  };

  return (
    // 🟢 bg-white ko hatakar bg-gray-900 kar diya (Sidebar jaisa dark color)
    <nav className="bg-gray-900 border-b border-gray-800 shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={isLoggedIn ? "/user" : "/"} className="flex items-center gap-2">
              {/* Icon ka background Yellow/Gold theme pe kar diya */}
              <div className="bg-yellow-600 p-2 rounded-lg">
                <Wallet className="h-6 w-6 text-gray-900" />
              </div>
              {/* Brand Name ko Sidebar jaisa Yellow color diya */}
              <span className="font-bold text-xl text-yellow-500 tracking-wider">TradePro</span>
            </Link>
          </div>

          {/* Menu Section */}
          <div className="flex items-center space-x-4">
            {!isLoggedIn ? (
              // LOGIN SE PEHLE DIKHNE WALE BUTTONS (Dark Theme matching)
              <>
                <Link to="/" className="text-gray-300 hover:text-yellow-500 font-medium px-3 py-2 rounded-md transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold px-5 py-2 rounded-lg transition-all shadow-md">
                  Register
                </Link>
              </>
            ) : (
              // LOGIN KE BAAD DIKHNE WALE BUTTONS (Dark Theme matching)
              <>
                {userRole === 'admin' ? (
                  <Link to="/admin" className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 font-medium px-3 py-2 rounded-md transition-colors">
                    <UserIcon className="w-4 h-4" /> Admin Panel
                  </Link>
                ) : (
                  <Link to="/user" className="flex items-center gap-2 text-gray-300 hover:text-yellow-500 font-medium px-3 py-2 rounded-md transition-colors">
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </Link>
                )}
                
                {/* Logout Button (Darker Red variant) */}
                <button 
                  onClick={handleLogout} 
                  className="flex items-center gap-2 bg-red-900/40 border border-red-800/50 hover:bg-red-800 text-red-400 hover:text-white font-medium px-4 py-2 rounded-lg transition-all"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;