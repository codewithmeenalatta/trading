import  { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { 
  LayoutDashboard, 
  Settings, 
  Network, 
  LineChart, 
  ArrowRightLeft, 
  Wallet, 
  HelpCircle,
  Menu,
  X,
  LogOut,
  Ticket,
  ChevronDown,
  ChevronRight,
   User,
   ShieldCheck,
   Upload,
   Download,
   ChevronUp,

   
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

const UserSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isHelpDeskOpen, setIsHelpDeskOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWalletOpen , setIsWalletOpen ] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

const handleLogout = async () => {
    try {
      // Backend api ko call karein (Apna sahi auth path likhein, jaise '/auth/logout' ya '/user/logout')
      const response = await api.post('/auth/logout'); 
      
      // Frontend se bhi data saaf kar dein
      localStorage.clear(); // Agar token localStorage me bhi hai, toh use hata dega
      
      // Success message dikhayen (Backend se jo message aaya hai wo)
      toast.success(response.data.message || "Logged out successfully");
      
      // User ko login page par redirect karein
      navigate("/"); // Ya "/login", jo bhi aapka login page ka path hai
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error(error.response?.data?.message || "Logout karne me kuch dikkat aayi");
    }
  };
  const isRouteActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 flex flex-col h-full border-r border-gray-800 ${isCollapsed ? 'w-20' : 'w-72'}`}>
      
      {/* 1. Header (Menu toggle button) */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800 flex-shrink-0">
        {!isCollapsed && <span className="text-sm font-semibold tracking-widest text-gray-400 uppercase">Menu</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1.5 hover:bg-gray-800 rounded-lg transition-colors text-gray-400">
          {isCollapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* 2. Navigation Links (Scrollable Area) */}
      <nav className="flex-1 py-4 flex flex-col gap-1.5 px-3 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-700 hover:[&::-webkit-scrollbar-thumb]:bg-gray-600">
        
        <Link to="/user" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${location.pathname === '/dashboard' ? 'bg-yellow-600 text-gray-900 font-semibold' : 'hover:bg-gray-800 text-gray-300'}`}>
          <LayoutDashboard size={20} className={location.pathname === '/dashboard' ? 'text-gray-900' : 'text-gray-400'} /> 
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        
<div className="flex flex-col">
          
          {/* Main Settings Button (Ispe click karne se dropdown khulega) */}
          <button 
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            className={`flex items-center justify-between px-3 py-3 rounded-lg transition-colors w-full outline-none ${
              location.pathname.includes('/user/settings') ? 'bg-gray-800 text-yellow-500 font-semibold' : 'hover:bg-gray-800 text-gray-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings size={20} className={location.pathname.includes('/user/settings') ? 'text-yellow-500' : 'text-gray-400'} /> 
              {!isCollapsed && <span>Settings</span>}
            </div>
            
            {/* Dropdown Arrow (Sirf tab dikhega jab sidebar khula ho) */}
            {!isCollapsed && (
              <span className={`text-xs transition-transform duration-200 ${isSettingsOpen ? 'rotate-180' : 'rotate-0'}`}>
                ▼
              </span>
            )}
          </button>

          {/* Sub-menu links (Profile, Wallet, Network) */}
          {!isCollapsed && isSettingsOpen && (
            <div className="flex flex-col ml-11 mt-1 space-y-3 py-2">
              
              {/* 1. Profile Link */}
<Link 
                to="/user/settings/profile" 
                className={`flex items-center gap-2.5 text-sm transition-all duration-200 ${
                  isRouteActive('/user/settings/profile') 
                    ? 'text-yellow-500 font-medium translate-x-1' 
                    : 'text-gray-400 hover:text-white hover:translate-x-1'
                }`}
              >
                <User size={16} className={isRouteActive('/user/settings/profile') ? 'text-yellow-500' : 'text-gray-500'} />
                <span>Profile</span>
              </Link>
              {/* 2. Wallet Address Link */}
<Link 
  to="/user/settings/wallet" 
  className={`flex items-center gap-2.5 text-sm transition-all duration-200 ${
    isRouteActive('/user/settings/wallet') 
      ? 'text-yellow-500 font-medium translate-x-1' 
      : 'text-gray-400 hover:text-white hover:translate-x-1'
  }`}
>
  <Wallet size={16} className={isRouteActive('/user/settings/wallet') ? 'text-yellow-500' : 'text-gray-500'} />
  <span>Wallet Address</span>
</Link>              {/* transaction password */}

<Link 
  to="/user/settings/transaction-password" 
  className={`flex items-center gap-2.5 text-sm transition-all duration-200 ${
    isRouteActive('/user/settings/transaction-password') 
      ? 'text-yellow-500 font-medium translate-x-1' 
      : 'text-gray-400 hover:text-white hover:translate-x-1'
  }`}
>
  <ShieldCheck size={16} className={isRouteActive('/user/settings/transaction-password') ? 'text-yellow-500' : 'text-gray-500'} />
  <span>Transaction Password</span>
</Link>



            </div>
          )}
        </div>

        <Link to="/network" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isRouteActive('/network') ? 'bg-gray-800 text-yellow-500 font-semibold' : 'hover:bg-gray-800 text-gray-300'}`}>
          <Network size={20} className={isRouteActive('/network') ? 'text-yellow-500' : 'text-gray-400'} /> 
          {!isCollapsed && <span>Network</span>}
        </Link>

<Link 
  to="/user/trade" 
  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isRouteActive('/user/trade') ? 'bg-gray-800 text-yellow-500 font-semibold' : 'hover:bg-gray-800 text-gray-300'}`}
>
  <LineChart size={20} className={isRouteActive('/user/trade') ? 'text-yellow-500' : 'text-gray-400'} /> 
  {!isCollapsed && <span>Trade</span>}
</Link>

<Link 
  to="/user/transaction" 
  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isRouteActive('/user/transaction') ? 'bg-gray-800 text-yellow-500 font-semibold' : 'hover:bg-gray-800 text-gray-300'}`}
>
  <ArrowRightLeft size={20} className={isRouteActive('/user/transaction') ? 'text-yellow-500' : 'text-gray-400'} /> 
  {!isCollapsed && <span>Transaction</span>}
</Link>
<div className="flex flex-col gap-1 w-full">
  {/* Main Wallet Button (Ise dabane se menu khulega) */}
  <button 
    onClick={() => setIsWalletOpen(!isWalletOpen)}
    className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${
      isRouteActive('/wallet') ? 'bg-gray-800 text-yellow-500 font-semibold' : 'hover:bg-gray-800 text-gray-300'
    }`}
  >
    <div className="flex items-center gap-3">
      <Wallet size={20} className={isRouteActive('/wallet') ? 'text-yellow-500' : 'text-gray-400'} /> 
      {!isCollapsed && <span>Wallet</span>}
    </div>
    
    {/* Arrow Icon jo up/down hoga */}
    {!isCollapsed && (
      isWalletOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />
    )}
  </button>

  {/* Ye Sub-Menu hai (Deposit aur Withdraw ka) - Ye tabhi dikhega jab isWalletOpen TRUE hoga */}
  {isWalletOpen && !isCollapsed && (
    <div className="flex flex-col gap-1 ml-9 mt-1 border-l border-gray-700 pl-3">
      
      {/* Naya Deposit Link */}
      <Link 
        to="/user/wallet/deposit" 
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
          isRouteActive('/wallet/deposit') ? 'text-yellow-500 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Download size={16} />
        <span>Deposit</span>
      </Link>

      {/* Naya Withdraw Link */}
      <Link 
        to="/user/wallet/withdraw" 
        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm ${
          isRouteActive('/wallet/withdraw') ? 'text-yellow-500 font-medium' : 'text-gray-400 hover:text-white hover:bg-gray-800'
        }`}
      >
        <Upload size={16} />
        <span>Withdraw</span>
      </Link>

    </div>
  )}
</div>

        {/* Help Desk (Dropdown Folder) */}
<div className="mt-2">
          <button 
            onClick={() => {
              if (isCollapsed) setIsCollapsed(false);
              setIsHelpDeskOpen(!isHelpDeskOpen);
            }} 
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${isRouteActive('/user/helpdesk') ? 'bg-gray-800 text-yellow-500 font-semibold' : 'hover:bg-gray-800 text-gray-300'}`}
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={20} className={isRouteActive('/user/helpdesk') ? 'text-yellow-500' : 'text-gray-400'} />
              {!isCollapsed && <span>Help Desk</span>}
            </div>
            {!isCollapsed && (
              isHelpDeskOpen ? <ChevronDown size={16} className="text-gray-500" /> : <ChevronRight size={16} className="text-gray-500" />
            )}
          </button>
          
          {!isCollapsed && isHelpDeskOpen && (
            <div className="mt-1 ml-4 pl-4 border-l border-gray-700 flex flex-col gap-1">
              
              {/* Naya New Ticket Path */}
              <Link to="/user/helpdesk/newticket" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isRouteActive('/user/helpdesk/newticket') ? 'bg-gray-800 text-yellow-500' : 'hover:bg-gray-800 text-gray-400'}`}>
                <Ticket size={16} /> New Ticket
              </Link>
              
              {/* Naya My Tickets Path */}
              <Link to="/user/helpdesk/mytickets" className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm ${isRouteActive('/user/helpdesk/mytickets') ? 'bg-gray-800 text-yellow-500' : 'hover:bg-gray-800 text-gray-400'}`}>
                <Ticket size={16} /> My Tickets
              </Link>

            </div>
          )}
        </div>
      </nav>

      {/* 3. Logout (Bottom Fix) */}
<div className="p-4 border-t border-gray-800">
        <button 
          onClick={handleLogout} 
          className="flex items-center gap-3 w-full px-3 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors outline-none"
        >
          <LogOut size={20} /> 
          {!isCollapsed && <span className="font-medium">Log out</span>}
        </button>
      </div>      
    </aside>
  );
};

export default UserSidebar;