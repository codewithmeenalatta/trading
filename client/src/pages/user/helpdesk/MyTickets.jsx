import  { useState, useEffect } from 'react';
import { Ticket, Clock, AlertCircle, Inbox } from 'lucide-react';

import api from '../../../api/axios'; // Apna axios path check kar lein

const MyTickets = () => {
    // 🟢 1. DYNAMIC STATES
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('ALL'); // Default sab dikhenge

    // 🟢 2. BACKEND SE DATA MANGWANA
    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await api.get('/tickets/my-tickets'); 
                setTickets(res.data);
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    // 🟢 3. FRONTEND FILTER LOGIC (Aapke UI design ke hisaab se)
    // Backend enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']
    const filteredTickets = tickets.filter(ticket => {
        if (activeTab === 'ALL') return true;
        if (activeTab === 'OPEN') return ticket.status === 'OPEN';
        // 'Processing' tab ke liye hum backend ka 'IN_PROGRESS' check karenge
        if (activeTab === 'IN_PROGRESS') return ticket.status === 'IN_PROGRESS' || ticket.status === 'RESOLVED';
        if (activeTab === 'CLOSED') return ticket.status === 'CLOSED';
        return true;
    });

    // 🟢 UI HELPERS (Colors aur Badges ke liye)
    const getStatusBadge = (status) => {
        if (status === 'OPEN') return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">Open</span>;
        if (status === 'IN_PROGRESS') return <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold border border-yellow-200">Processing</span>;
        if (status === 'RESOLVED' || status === 'CLOSED') return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">Closed</span>;
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold border border-gray-200">{status}</span>;
    };

    const getPriorityColor = (priority) => {
        if (priority === 'HIGH') return 'text-red-500 font-semibold';
        if (priority === 'MEDIUM') return 'text-yellow-600 font-semibold';
        return 'text-green-500 font-semibold';
    };

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8">
            
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Ticket className="text-blue-600" size={32} /> My Tickets
                </h1>
                <p className="text-gray-500 mt-2">Track the status of your support requests.</p>
            </div>

            {/* 🟢 Filter Tabs (Jo aapne UI mein maange hain) */}
            <div className="flex overflow-x-auto gap-2 mb-6 pb-2 scrollbar-hide">
                <button 
                    onClick={() => setActiveTab('ALL')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'ALL' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    All Statuses
                </button>
                <button 
                    onClick={() => setActiveTab('OPEN')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'OPEN' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    Open
                </button>
                <button 
                    onClick={() => setActiveTab('IN_PROGRESS')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'IN_PROGRESS' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    Processing
                </button>
                <button 
                    onClick={() => setActiveTab('CLOSED')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'CLOSED' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                >
                    Closed
                </button>
            </div>

            {/* 🟢 Main Content Area */}
            {loading ? (
                // Loader jab data aa raha ho
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : filteredTickets.length === 0 ? (
                // 🟢 Empty State (Jo aapne exact UI mein bheja tha)
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center mt-4">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                        <Inbox className="text-gray-400" size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">No tickets found</h2>
                    <p className="text-gray-500">You haven't raised any support tickets yet.</p>
                </div>
            ) : (
                // 🟢 Tickets List (Dynamic UI)
                <div className="space-y-4">
                    {filteredTickets.map((ticket) => (
                        <div key={ticket._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-300 transition-all group">
                            
                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4 mb-3">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {ticket.subject}
                                        </h3>
                                        {getStatusBadge(ticket.status)}
                                    </div>
                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                        {ticket.description}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 pt-4 border-t border-gray-100 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <Clock size={16} />
                                    <span>{new Date(ticket.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-500">
                                    <AlertCircle size={16} />
                                    <span>Priority: <span className={getPriorityColor(ticket.priority)}>{ticket.priority}</span></span>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

        </div>
    );
};

export default MyTickets;