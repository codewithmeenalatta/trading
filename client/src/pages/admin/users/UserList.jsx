import { useState, useEffect } from 'react';
import { Search, Filter, RefreshCcw } from 'lucide-react';
import api from '../../../api/axios.js'; // Ensure path is correct
import toast from 'react-hot-toast';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Backend se asli data fetch karne ka function
  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/admin/all-users'); // Backend me yeh route banayenge (Step 2 dekhein)
      setUsers(res.data);
    } catch (error) {
      toast.error("Failed to load user list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">User List</h1>
        <p className="text-gray-500">Search, filter and manage every registered account</p>
      </div>

      {/* Filter Section (Abhi UI hai, isko aap future mein working bana sakte ho) */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Greater than</label>
            <input type="number" placeholder="Amount" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Less than</label>
            <input type="number" placeholder="Amount" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Type</label>
            <select className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 bg-white">
              <option>Select --</option>
              <option>Main Balance</option>
              <option>Staked Balance</option>
              <option>Trade Balance</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
            <input type="date" className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500" />
          </div>
        </div>
        <div className="flex gap-3 mt-2">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 transition">
            <Search size={16} /> Apply
          </button>
          <button onClick={fetchAllUsers} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
            <RefreshCcw size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-gray-500 font-medium">Fetching data from server...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Main balance</th>
                  <th className="px-6 py-4">Trade Wallet</th>
                  <th className="px-6 py-4">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition">
                      {/* Short ID dikhane ke liye ID ke aakhri 6 characters use kar rahe hain */}
                      <td className="px-6 py-4 font-bold text-gray-900">...{user._id.slice(-6)}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{user.name}</td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 font-bold text-green-600">₹ {user.mainWallet}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">₹ {user.tradeWallet}</td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination (Static for now) */}
        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600">
          <button className="px-4 py-2 border border-gray-200 bg-white rounded hover:bg-gray-100 disabled:opacity-50">Previous</button>
          <span className="font-medium">Total Users: {users.length}</span>
          <button className="px-4 py-2 border border-gray-200 bg-white rounded hover:bg-gray-100">Next</button>
        </div>
      </div>
    </div>
  );
};

export default UserList;