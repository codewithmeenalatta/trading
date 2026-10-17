import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import toast from 'react-hot-toast';
import { Trash2, Plus, Power, PowerOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const PopupList = () => {
  const [popups, setPopups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Yahan par hum backend se sirf "popup" type mangwa rahe hain
  const fetchPopups = async () => {
    try {
      const res = await api.get('/admin/content?type=popup');
      setPopups(res.data);
    } catch (error) {
      toast.error("Failed to load Popups");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this popup?")) {
      try {
        await api.delete(`/admin/content/${id}`);
        toast.success("Popup deleted successfully");
        fetchPopups();
      } catch (error) {
        toast.error("Failed to delete popup");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/content/${id}/toggle`);
      toast.success("Popup status updated");
      fetchPopups();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Popups</h1>
          <p className="text-gray-500 text-sm mt-1">Manage popups that appear on top of the screen.</p>
        </div>
        <Link 
          to="/admin/popups/add" 
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add Popup
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 font-medium">Loading popups...</p>
        </div>
      ) : popups.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm mt-10">
          <p className="text-gray-800 font-semibold mb-2">No active popups</p>
          <p className="text-gray-500 mb-6">Create a popup to show important announcements or offers to users.</p>
          <Link 
            to="/admin/popups/add" 
            className="inline-flex items-center gap-2 border border-purple-600 text-purple-600 px-6 py-2 rounded-lg hover:bg-purple-50 transition"
          >
            <Plus size={18} /> Add Popup
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popups.map((popup) => (
            <div key={popup._id} className="bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col">
              {/* Image Preview (Popups me choti image hoti hai to square rakhi hai) */}
              <div className="w-full aspect-square bg-gray-100 p-4 flex justify-center items-center">
                 <img src={popup.imageUrl} alt={popup.title} className="max-h-full object-contain rounded-md shadow-sm border border-gray-200" />
              </div>
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-semibold text-lg text-gray-800 truncate">{popup.title}</h3>
                {popup.link && <p className="text-xs text-blue-500 truncate mt-1">{popup.link}</p>}
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => toggleStatus(popup._id)}
                    className={`flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded-md transition ${popup.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    {popup.isActive ? <Power size={16} /> : <PowerOff size={16} />}
                    {popup.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <button 
                    onClick={() => handleDelete(popup._id)} 
                    className="text-red-500 hover:bg-red-50 p-2 rounded transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopupList;