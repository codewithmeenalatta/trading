import React, { useState } from 'react';
import api from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddBanner = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ 
      title: '', 
      imageUrl: '', 
      link: '' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Backend pe /admin/content/add par bhej rahe hain with type='banner'
      await api.post('/admin/content/add', { ...formData, type: 'banner' });
      toast.success(`Banner added successfully!`);
      navigate('/admin/banners'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add banner");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Add New Banner</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        
        {/* Banner Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title</label>
          <input 
            type="text" 
            required
            placeholder="E.g., Diwali Offer Banner"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
          <input 
            type="url" 
            required
            placeholder="https://res.cloudinary.com/.../image.jpg"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.imageUrl} 
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
          />
          <p className="text-xs text-gray-500 mt-1">Direct link to your uploaded banner image.</p>
        </div>

        {/* Target Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Link (Optional)</label>
          <input 
            type="url"
            placeholder="https://yourwebsite.com/offers"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={formData.link} 
            onChange={(e) => setFormData({...formData, link: e.target.value})} 
          />
        </div>

        {/* Buttons */}
        <div className="pt-4 flex gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin/banners')}
            className="flex-1 bg-gray-100 text-gray-700 p-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-blue-600 text-white p-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Saving...' : `Save Banner`}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddBanner;