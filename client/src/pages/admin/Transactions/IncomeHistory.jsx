import { useState, useEffect } from 'react';
import { Download, RefreshCcw, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

const IncomeHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncomeHistory = async () => {
    setLoading(true);
    try {
      // Future API connection
      // const res = await api.get('/admin/transactions/income-history');
      // setHistory(res.data);
      
      // Fake delay for now
      setTimeout(() => setLoading(false), 500); 
    } catch (error) {
      toast.error("Failed to load income history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomeHistory();
  }, []);

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
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-gray-500">
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
                       {/* Map backend Data Here in future */}
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

// YE LINE MISSING THI PICHLE CODE ME, JISKI WAJAH SE ERROR AA RAHA THA:
export default IncomeHistory;