import React, { useState } from 'react';
import api from '../../../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddPopup = () => {
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
      // Dekho bhai, yahan type: 'popup' lagaya hai wahi purane route pe
      await api.post('/admin/content/add', { ...formData, type: 'popup' });
      toast.success(`Popup created successfully!`);
      navigate('/admin/popups'); 
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create popup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto w-full">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Popup</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Popup Name (For your reference)</label>
          <input 
            type="text" 
            required
            placeholder="E.g., Welcome Bonus Popup"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={formData.title} 
            onChange={(e) => setFormData({...formData, title: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Square or Portrait works best)</label>
          <input 
            type="url" 
            required
            placeholder="https://res.cloudinary.com/.../popup-image.jpg"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={formData.imageUrl} 
            onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} 
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Target Link (Optional)</label>
          <input 
            type="url"
            placeholder="https://yourwebsite.com/bonus"
            className="w-full border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            value={formData.link} 
            onChange={(e) => setFormData({...formData, link: e.target.value})} 
          />
          <p className="text-xs text-gray-500 mt-1">If user clicks the popup image, they will be sent here.</p>
        </div>

        <div className="pt-4 flex gap-4">
          <button 
            type="button" 
            onClick={() => navigate('/admin/popups')}
            className="flex-1 bg-gray-100 text-gray-700 p-2.5 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 bg-purple-600 text-white p-2.5 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors font-medium"
          >
            {loading ? 'Publishing...' : `Publish Popup`}
          </button>
        </div>

      </form>
    </div>
  );
};

export default AddPopup;