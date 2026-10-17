import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ShieldCheck, Clock, CheckCircle, XCircle } from 'lucide-react';
// import api from '../../api/axios.js';
import api from '../../api/axios.js';

const AdminPanel = () => {
  const [pendingDeposits, setPendingDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null); // track which ID is processing

  // Pending deposits fetch karna
  const fetchDeposits = async () => {
    try {
      const res = await api.get('/admin/deposits');
      setPendingDeposits(res.data);
    } catch (error) {
      toast.error("Failed to load deposit requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, []);

  // Deposit Accept ya Decline karna
  const handleAction = async (transactionId, status) => {
    setActionLoading(transactionId);
    try {
      await api.post('/admin/deposit-action', { transactionId, status });
      toast.success(`Deposit ${status} successfully!`);
      fetchDeposits(); // List refresh karna
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <div className="min-h-[80vh] flex justify-center items-center text-xl font-semibold">Loading Admin Panel...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gray-900 p-3 rounded-xl">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
          <p className="text-gray-500">Manage user deposits and platform activity</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" /> Pending Deposit Requests
          </h3>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
            {pendingDeposits.length} Pending
          </span>
        </div>

        {pendingDeposits.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            All caught up! No pending deposit requests right now.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {pendingDeposits.map((req) => (
              <div key={req._id} className="p-6 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:bg-gray-50 transition-colors">
                
                <div>
                  <p className="text-sm text-gray-500">Requested by</p>
                  <p className="font-bold text-gray-900">{req.user?.name} <span className="font-normal text-gray-500">({req.user?.email})</span></p>
                  <p className="text-xs text-gray-400 mt-1">Date: {new Date(req.createdAt).toLocaleString()}</p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="text-xl font-bold text-green-600">₹{req.amount.toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleAction(req._id, 'accepted')}
                    disabled={actionLoading === req._id}
                    className="flex items-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <CheckCircle className="w-4 h-4" /> {actionLoading === req._id ? 'Wait...' : 'Accept'}
                  </button>
                  <button 
                    onClick={() => handleAction(req._id, 'declined')}
                    disabled={actionLoading === req._id}
                    className="flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    <XCircle className="w-4 h-4" /> Decline
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPanel;