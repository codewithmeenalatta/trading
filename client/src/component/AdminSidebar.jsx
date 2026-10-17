import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ArrowRightLeft, FileText, Ticket, LogOut, Menu, X, ChevronDown, ChevronRight,  } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const AdminSidebar = ( {isCollapsed, setIsCollapsed}) => {
  
  const [isUsersOpen, setIsUsersOpen] = useState(true); 
  const [isTransactionsOpen, setIsTransactionsOpen] = useState(false); 
  // const [isIncomeOpen, setIsIncomeOpen] = useState(false);
  const [isContentOpen, setIsContentOpen] = useState(false); 

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
        await api.post('/auth/logout');
        localStorage.clear();
        toast.success("Loggout out sucessfully");
        navigate("/")
    } catch (error) {
        console.log("Logout error:" , error);
        toast.error("Logout karne m kuch dikkt aayi");
    }
  };

  const isRouteActive = (basePath) => location.pathname.includes(basePath);

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 flex flex-col h-screen ${isCollapsed ? 'w-20' : 'w-64'}`}>
      
      {/* Sidebar Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-800">
        {!isCollapsed && <span className="text-xl font-bold tracking-wider text-blue-400">BoostAdmin</span>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
          {isCollapsed ? <Menu size={24} /> : <X size={24} />}
        </button>
      </div>

      {/* YAHAN FIX KIYA HAI: Ye 3 nayi classes add ki hain jisse wo white scrollbar line hide ho jayegi par scroll kaam karega */}
      <nav className="flex-1 py-4 flex flex-col gap-2 px-3 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Dashboard */}
        <Link to="/admin" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${location.pathname === '/admin' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
          <LayoutDashboard size={20} /> {!isCollapsed && <span>Dashboard</span>}
        </Link>

        {/* ===================== USERS ===================== */}
        <div>
          <button 
            onClick={() => setIsUsersOpen(!isUsersOpen)} 
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors ${isRouteActive('/admin/users') ? 'bg-gray-800 text-blue-400' : ''}`}
          >
            <div className="flex items-center gap-3">
              <Users size={20} /> 
              {!isCollapsed && <span>Users</span>}
            </div>
            {!isCollapsed && (isUsersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </button>
          
          {!isCollapsed && isUsersOpen && (
            <div className="ml-4 pl-4 mt-1 flex flex-col gap-1">
              <Link to="/admin/users/list" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/users/list' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>User List</Link>
              <Link to="/admin/users/offers" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/users/offers' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Bumper Offers</Link>
              <Link to="/admin/users/documents" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/users/documents' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Documents</Link>
            </div>
          )}
        </div>

        {/* ===================== TRANSACTIONS ===================== */}
        <div>
          <button 
            onClick={() => setIsTransactionsOpen(!isTransactionsOpen)} 
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors ${isRouteActive('/admin/transactions') ? 'bg-gray-800 text-blue-400' : ''}`}
          >
            <div className="flex items-center gap-3">
              <ArrowRightLeft size={20} /> 
              {!isCollapsed && <span>Transactions</span>}
            </div>
            {!isCollapsed && (isTransactionsOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </button>
          
          {!isCollapsed && isTransactionsOpen && (
            <div className="ml-4 pl-4 mt-1 flex flex-col gap-1">
              <Link to="/admin/transactions/list" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/transactions/list' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Transaction List</Link>
<Link to="/admin/transactions/pending" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/transactions/pending' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Pending Transactions</Link>
              <Link to="/admin/transactions/income" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/transactions/income' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Income History</Link>
            </div>
          )}
        </div>

        {/* Other Links */}
<div>
          <button 
            onClick={() => setIsContentOpen(!isContentOpen)} 
            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-800 transition-colors ${isRouteActive('/admin/banners') || isRouteActive('/admin/popups') ? 'bg-gray-800 text-blue-400' : ''}`}
          >
            <div className="flex items-center gap-3">
              <FileText size={20} /> 
              {!isCollapsed && <span>Content</span>}
            </div>
            {!isCollapsed && (isContentOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}
          </button>
          
          {!isCollapsed && isContentOpen && (
            <div className="ml-4 pl-4 mt-1 flex flex-col gap-1">
              <Link to="/admin/banners" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/banners' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Banner List</Link>
              
              <Link to="/admin/banners/add" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/banners/add' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Add Banner</Link>

              <Link to="/admin/popups" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/popups' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Popup List</Link>

              <Link to="/admin/popups/add" className={`px-3 py-2 rounded-md text-sm transition-colors ${location.pathname === '/admin/popups/add' ? 'bg-gray-800 text-blue-400 font-medium' : 'text-gray-400 hover:text-white'}`}>Add Popup</Link>
            </div>
          )}
        </div>

        {/* Tickets */}
        <Link to="/admin/tickets" className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${location.pathname === '/admin/tickets' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}>
          <Ticket size={20} /> {!isCollapsed && <span>Tickets</span>}
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-3 text-red-400 hover:bg-gray-800 rounded-lg transition-colors">
          <LogOut size={20} /> {!isCollapsed && <span className="font-medium">Log out</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;