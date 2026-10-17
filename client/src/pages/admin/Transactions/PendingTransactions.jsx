import { useState, useEffect } from 'react';
import { RefreshCcw,  Search, AlertCircle, Eye } from 'lucide-react';
import api from '../../../api/axios.js';
import toast from 'react-hot-toast';

const PendingTransactions = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPendingRequests = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/transactions/pending-withdrawals');
      setPendingRequests(res.data);
    } catch (error) {
      toast.error("Failed to load pending requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const handleReview = async (id, actionType) => {
    if (!window.confirm(`Are you sure you want to ${actionType} this withdrawal?`)) return;
    
    setProcessingId(id);
    try {
      await api.post('/admin/transactions/process-withdrawal', {
        transactionId: id,
        action: actionType // 'APPROVED' or 'REJECTED'
      });
      toast.success(`Request ${actionType} successfully`);
      fetchPendingRequests(); // Automatically refresh list after action
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process request");
    } finally {
      setProcessingId(null);
    }
  };

  // Frontend Search Filter Logic
  const filteredRequests = pendingRequests.filter(req => {
    const term = searchTerm.toLowerCase();
    return (
      req.user?.name?.toLowerCase().includes(term) ||
      req.user?.goldenId?.toLowerCase().includes(term) ||
      req.wallet?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 min-h-screen pb-20 w-full min-w-0">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pending Requests</h1>
          <p className="text-sm sm:text-base text-gray-500">Withdrawal requests awaiting approval or refund.</p>
        </div>
      </div>

      {/* Toolbar / Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        {/* Search Input */}
        <div className="relative w-full sm:w-96">
          <input 
            type="text" 
            placeholder="Search by Name, Golden ID or Wallet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-blue-500 text-sm"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>

        {/* Refresh Button */}
        <button 
          onClick={fetchPendingRequests} 
          className="flex justify-center items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition w-full sm:w-auto"
        >
          <RefreshCcw size={16} /> Refresh
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full overflow-hidden">
        
        {/* Table Details Info */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-gray-700">Awaiting Action</h3>
          <span className="text-xs font-semibold text-gray-500 bg-gray-200/60 px-3 py-1 rounded-full">
            Total Pending: {filteredRequests.length}
          </span>
        </div>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto w-full">
          {loading ? (
             <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading live pending data...</div>
          ) : (
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[900px]">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-4">Name / Golden ID</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Wallet</th>
                  <th className="px-6 py-4">Payable Amount</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                
                {filteredRequests.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-16 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-3">
                        <AlertCircle className="w-12 h-12 text-gray-300" />
                        <p className="text-lg font-semibold text-gray-600">No pending requests.</p>
                        <p className="text-sm text-gray-400">All withdrawal requests have been processed.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr key={req._id} className="hover:bg-gray-50 transition">
                      
                      {/* Name & ID Column */}
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{req.user?.name || "Unknown User"}</div>
                        <div className="text-xs text-blue-600 font-bold bg-blue-50 inline-block px-2 py-0.5 rounded mt-1">
                          {req.user?.goldenId || "GOLDxxxxxx"}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 font-semibold text-gray-700">{req.type}</td>
                      <td className="px-6 py-4 font-medium text-gray-600">{req.wallet}</td>
                      
                      <td className="px-6 py-4 font-bold text-gray-900 text-lg">
                        ${Math.abs(req.amount)}
                      </td>
                      
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString('en-US')}
                      </td>
                      
                      <td className="px-6 py-4">
                        <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs px-3 py-1 rounded-md font-bold inline-flex items-center gap-1">
                          <Eye size={12} /> {req.status}
                        </span>
                      </td>
                      
                      {/* Review Buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            onClick={() => handleReview(req._id, 'APPROVED')}
                            disabled={processingId === req._id}
                            className="bg-green-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-green-700 transition shadow-sm disabled:opacity-50"
                          >
                            Review & Approve
                          </button>
                          <button 
                            onClick={() => handleReview(req._id, 'REJECTED')}
                            disabled={processingId === req._id}
                            className="bg-red-600 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:bg-red-700 transition shadow-sm disabled:opacity-50"
                          >
                            Reject (Refund)
                          </button>
                        </div>
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

export default PendingTransactions;