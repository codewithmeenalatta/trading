import { useState, useEffect } from 'react';
import { Download, Search,  ArrowRightLeft } from 'lucide-react';
import api from '../../../api/axios.js';
import toast from 'react-hot-toast';

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const fetchTransactions = async () => {
    setLoading(true);
    try {
     
      const query = new URLSearchParams();
      
      const res = await api.get(`/admin/transactions/all?${query.toString()}`);
      setTransactions(res.data);
      setTimeout(() => setLoading(false), 500); 
    } catch (error) {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleExportExcel = () => {
    toast.success("Excel report exported successfully!");
  };

  return (
    // 'min-w-0' aur 'overflow-hidden' page ko bahar slide hone se rokenge
    <div className="space-y-6 min-h-screen pb-20 w-full min-w-0">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="text-sm sm:text-base text-gray-500">Review, filter and process every ledger movement.</p>
      </div>

      {/* Responsive Filter Section */}
      <div className="bg-white p-4 sm:p-5 rounded-xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          
          <div className="w-full">
            <button onClick={handleExportExcel} className="w-full flex justify-center items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
              <Download size={16} /> Export Excel
            </button>
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 text-sm bg-white">
              <option value="ALL">All Statuses</option>
              <option value="PENDING">PENDING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>

          <div className="w-full">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Transaction Type</label>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none focus:border-blue-500 text-sm bg-white">
              <option value="ALL">All Types</option>
              <option value="DEPOSIT">DEPOSIT</option>
              <option value="WITHDRAWAL">WITHDRAWAL</option>
              <option value="STAKING">STAKING</option>
              <option value="ROI_REWARD">ROI_REWARD</option>
              <option value="GENERATION-REWARD">GENERATION-REWARD</option>
              <option value="RANK-BONUS">RANK-BONUS</option>
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
            <button onClick={fetchTransactions} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
              <Search size={16} /> Filter
            </button>
          </div>

        </div>
      </div>

      {/* Transactions Table Section */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col w-full max-w-full">
        
        {/* YAHAN DEKHIYE: w-full aur overflow-x-auto hona zaruri hai */}
        <div className="w-full overflow-x-auto">
          {loading ? (
             <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading live ledger data...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[1000px] whitespace-nowrap">              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Wallet</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Hash ID / UTR</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-800">
                
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center space-y-2">
                        <ArrowRightLeft className="w-10 h-10 text-gray-300" />
                        <p className="font-semibold text-gray-600">No transactions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition">
                      {/* Live Data jab aayega tab yaha fields show hongi */}
                    </tr>
                  ))
                )}
                
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Area with Pagination */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 gap-4 rounded-b-xl">
          <div className="flex items-center gap-2">
            <span>Rows</span>
            <select className="border border-gray-300 rounded p-1 outline-none bg-white">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 transition">Previous</button>
            <span className="font-medium text-gray-600">Page 1 of 1</span>
            <button className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-100 transition">Next</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TransactionList;