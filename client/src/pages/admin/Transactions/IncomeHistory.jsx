import { useState, useEffect } from 'react';
import { Download, RefreshCcw, Activity, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../../api/axios';

const IncomeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchIncomeHistory = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      
      if (statusFilter && statusFilter !== "ALL") query.append("status", statusFilter);
      if (typeFilter && typeFilter !== "ALL") query.append("type", typeFilter);
      if (fromDate) query.append("fromDate", fromDate);
      if (toDate) query.append("toDate", toDate);

      const res = await api.get(`/admin/transactions/income-history?${query.toString()}`);
      
      setHistory(res.data); 
    } catch (error) {
      console.log("Income History Error:", error);
      toast.error("Failed to load income history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeHistory();
  }, []); // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6 min-h-screen pb-20 w-full min-w-0">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Income History</h1>
          <p className="text-sm sm:text-base text-gray-500">Track all income generated over time.</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm">
                <Download size={16} /> Export
            </button>
            <button onClick={fetchIncomeHistory} className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition shadow-sm">
                <RefreshCcw size={16} /> Refresh
            </button>
        </div>
      </div>

      {/* 🟢 NEW: Filter Section (Pehle missing tha) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          
          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 text-sm bg-white">
              <option value="ALL">All Statuses</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="PENDING">PENDING</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Income Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 text-sm bg-white">
              <option value="ALL">All Incomes</option>
              <option value="ROI_REWARD">ROI REWARD</option>
              <option value="GENERATION-REWARD">GENERATION REWARD</option>
              <option value="RANK-BONUS">RANK BONUS</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 text-sm" />
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 text-sm" />
          </div>

          <div className="w-full flex gap-2">
            <button onClick={fetchIncomeHistory} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              <Search size={16} /> Filter
            </button>
          </div>

        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full overflow-hidden">
        
        {/* Table Wrapper */}
        <div className="overflow-x-auto w-full">
          {loading ? (
             <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Fetching history...</div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[700px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Income Type</th>
                  <th className="px-6 py-4 font-bold text-gray-800">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-16 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <Activity className="w-12 h-12 text-gray-300" />
                        <p className="text-lg font-semibold text-gray-600">No income history available.</p>
                        <p className="text-sm text-gray-400">All generated income will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  history.map((record, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                        {/* 🟢 FIXED: Yahan actual data render kiya gaya hai */}
                        <td className="px-6 py-4 font-medium text-gray-900">
                           {record.user?.name || "Unknown User"} 
                           <span className="block text-xs text-gray-500">{record.user?.goldenId}</span>
                        </td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium">
                             {record.type}
                           </span>
                        </td>
                        <td className="px-6 py-4 font-bold text-green-600">
                           + ${record.amount}
                        </td>
                        <td className="px-6 py-4">
                           <span className={`px-2 py-1 text-xs rounded font-medium ${
                             record.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'
                           }`}>
                             {record.status}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                           {new Date(record.createdAt).toLocaleDateString()}
                        </td>
                    </tr>
                  ))
                )}
                
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomeHistory;