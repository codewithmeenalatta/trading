import { useState, useEffect } from 'react';
import { Gift, Plus, Trash2 } from 'lucide-react';
import api from '../../../api/axios.js';
import toast from 'react-hot-toast';

const BumperOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Backend se saare Bumper Offers fetch karne ka function
  const fetchBumperOffers = async () => {
    try {
      const res = await api.get('/admin/bumper-offers/all');
      setOffers(res.data);
    } catch (error) {
      toast.error("Failed to load bumper offers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBumperOffers();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bumper Offer</h1>
          <p className="text-gray-500">Reward tiers & eligible users from live database</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Table Title Section */}
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-800">All Bumper Offer Users</h3>
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-md">
            Live from Database
          </span>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-10 text-center text-gray-500 font-medium animate-pulse">Loading live data...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-sm font-semibold text-gray-600">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Mobile</th>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Business</th>
                  <th className="px-6 py-4">Reward</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                
                {offers.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-10 text-center text-gray-500 italic">
                      No bumper offers found in the database.
                    </td>
                  </tr>
                ) : (
                  offers.map((offer, idx) => (
                    <tr key={offer._id || idx} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 text-gray-800 font-medium">{offer.user?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-500">{offer.user?.email || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-500">{offer.mobile}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">{offer.rank}</td>
                      <td className="px-6 py-4 font-bold text-green-600">${offer.business}</td>
                      <td className="px-6 py-4 font-medium text-purple-600 flex items-center gap-1">
                        <Gift size={16} /> {offer.reward}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`text-xs px-3 py-1 rounded-md font-bold ${
                          offer.status === 'Achieved' ? 'bg-green-100 text-green-800' : 
                          offer.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}

              </tbody>
            </table>
          )}
        </div>

        {/* Footer Area */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 text-center">
           <p className="text-sm font-medium text-gray-500">
             Total Records: {offers.length}
           </p>
        </div>

      </div>
    </div>
  );
};

export default BumperOffers;