import React, { useState, useEffect } from 'react';
import api from '../../../api/axios'; // Aapka setup kiya hua axios
import toast from 'react-hot-toast';
import { Trash2, Plus, Power, PowerOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const BannerList = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Saare Banners fetch karne ka function
  const fetchBanners = async () => {
    try {
      const res = await api.get('/admin/content?type=banner');
      setBanners(res.data);
    } catch (error) {
      toast.error("Failed to load Banners");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Delete Banner function
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this banner?")) {
      try {
        await api.delete(`/admin/content/${id}`);
        toast.success("Banner deleted successfully");
        fetchBanners(); 
      } catch (error) {
        toast.error("Failed to delete banner");
      }
    }
  };

  // Status (On/Off) toggle function
  const toggleStatus = async (id) => {
    try {
      await api.put(`/admin/content/${id}/toggle`);
      toast.success("Banner status updated");
      fetchBanners(); 
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 w-full">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Banners</h1>
          <p className="text-gray-500 text-sm mt-1">Manage the banners shown on the home page.</p>
        </div>
        <Link 
          to="/admin/banners/add" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <Plus size={18} /> Add banner
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
            <p className="text-gray-500 font-medium">Loading banners...</p>
        </div>
      ) : banners.length === 0 ? (
        // Empty State (Jab koi banner na ho)
        <div className="text-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm mt-10">
          <p className="text-gray-800 font-semibold mb-2">No banners yet</p>
          <p className="text-gray-500 mb-6">Banners appear on the website home page. Upload your first one to get started.</p>
          <Link 
            to="/admin/banners/add" 
            className="inline-flex items-center gap-2 border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition"
          >
            <Plus size={18} /> Add banner
          </Link>
        </div>
      ) : (
        // Banners Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner._id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <img src={banner.imageUrl} alt={banner.title} className="w-full h-48 object-cover bg-gray-100" />
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800">{banner.title}</h3>
                
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => toggleStatus(banner._id)}
                    className={`flex items-center gap-1.5 text-sm font-medium px-2 py-1 rounded-md transition ${banner.isActive ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                    {banner.isActive ? <Power size={16} /> : <PowerOff size={16} />}
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </button>

                  <button 
                    onClick={() => handleDelete(banner._id)} 
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

export default BannerList;