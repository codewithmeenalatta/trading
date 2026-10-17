import  { useState } from 'react';
import { HelpCircle, Send, Info, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../api/axios'; // Apna axios ka path check kar lijiye

const NewTicket = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // 🟢 DYNAMIC STATE (Aapke backend schema ke hisaab se)
    const [formData, setFormData] = useState({
        subject: '',
        priority: '',
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 🟢 SUBMIT FUNCTION (Seedha backend api par jayega)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.priority) {
            return toast.error("Please select a priority level");
        }

        setLoading(true);
        try {
            // Backend ko request bhejna
            const response = await api.post('/tickets/create', formData);
            
            toast.success(response.data.message || "Ticket created successfully!");
            
            // Form clear karna
            setFormData({ subject: '', priority: '', description: '' });
            
            // Ticket banne ke baad automatic My Tickets page par bhej dena
            navigate('/user/helpdesk/mytickets');
        } catch (error) {
            console.error("Ticket error:", error);
            toast.error(error.response?.data?.message || "Failed to submit ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <HelpCircle className="text-blue-600" size={32} /> Create New Ticket
                </h1>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Describe your issue and our support team will get back to you.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Form Area */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 p-6 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-800">Ticket Details</h2>
                        <p className="text-xs text-gray-500 mt-1">Fields marked * are required.</p>
                    </div>

                    <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            
                            {/* Title / Subject */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Title *</label>
                                <input 
                                    type="text" 
                                    name="subject" // Backend ke hisaab se subject
                                    required 
                                    value={formData.subject} 
                                    onChange={handleChange}
                                    placeholder="Enter a brief title for your issue" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all"
                                />
                            </div>

                            {/* Priority Dropdown */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Priority *</label>
                                <select 
                                    name="priority" 
                                    required
                                    value={formData.priority} 
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700 transition-all"
                                >
                                    <option value="" disabled>Select Priority --</option>
                                    <option value="LOW">Low</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HIGH">High</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Describe your problem *</label>
                                <textarea 
                                    name="description" 
                                    required 
                                    rows="5"
                                    value={formData.description} 
                                    onChange={handleChange}
                                    placeholder="Please provide as much detail as possible..." 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-y transition-all"
                                ></textarea>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                {loading ? "Submitting..." : <><Send size={18} /> Submit Ticket</>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right Side: Information Box */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl">
                        <div className="flex items-center gap-2 text-blue-800 mb-3">
                            <Info size={20} />
                            <h3 className="font-bold">Response time</h3>
                        </div>
                        <p className="text-sm text-blue-900/80 leading-relaxed">
                            Most tickets receive a first response within <strong>24 hours</strong>. High-priority issues are reviewed first.
                        </p>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 p-6 rounded-xl">
                        <div className="flex items-center gap-2 text-gray-700 mb-3">
                            <CheckCircle size={20} />
                            <h3 className="font-bold">Track Status</h3>
                        </div>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Track responses anytime under Help {'>'} My Tickets.
                        </p>
                        <Link 
                            to="/user/helpdesk/mytickets"
                            className="inline-block mt-4 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            View My Tickets &rarr;
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default NewTicket;