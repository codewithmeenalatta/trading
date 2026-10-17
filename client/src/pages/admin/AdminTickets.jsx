import React, { useState, useEffect } from 'react';
import api from '../../api/axios'; // Aapka axios import
import toast from 'react-hot-toast';
import { Eye, Edit } from 'lucide-react'; // Icons

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filters ki state
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [limit, setLimit] = useState(10); 

  // Backend se tickets laane ka function
  const fetchTickets = async () => {
    setLoading(true);
    try {
      let url = '/tickets/all?';
      if (statusFilter) url += `status=${statusFilter}&`;
      if (priorityFilter) url += `priority=${priorityFilter}&`;

      const res = await api.get(url);
      setTickets(res.data);
    } catch (error) {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter, priorityFilter]);

  // Status colors setup
  const getStatusColor = (status) => {
    switch(status) {
      case 'OPEN': return 'bg-green-100 text-green-700 border-green-200';
      case 'IN_PROGRESS': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'RESOLVED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'CLOSED': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'HIGH': return 'text-red-600 bg-red-50';
      case 'MEDIUM': return 'text-orange-600 bg-orange-50';
      case 'LOW': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Support Tickets</h1>
        <p className="text-gray-500 text-sm mt-1">Track, filter and resolve user support requests.</p>
        <p className="text-sm font-medium text-gray-600 mt-2">{tickets.length} total records</p>
      </div>

      {/* Filters Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        
        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Filter by Status</label>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="RESOLVED">RESOLVED</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs font-semibold text-gray-500 uppercase mb-1">Filter by Priority</label>
          <select 
            value={priorityFilter} 
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-gray-300 rounded-md p-2 outline-none focus:border-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600 uppercase tracking-wider">
                <th className="p-4">Subject</th>
                <th className="p-4">Golden ID</th>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">Loading tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-gray-500">No tickets found matching your filters.</td>
                </tr>
              ) : (
                tickets.slice(0, limit).map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{ticket.subject}</td>
                    <td className="p-4 text-gray-600 font-mono text-sm">{ticket.userId?.kyc?.goldenId || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{ticket.userId?.name || 'Unknown User'}</td>
                    
                    <td className="p-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(ticket.status)}`}>
                        {ticket.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span className={`px-2 py-1 text-xs font-bold rounded ${getPriorityColor(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </td>

                    <td className="p-4 text-gray-500 text-sm">
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1 text-sm font-medium">
                          <Eye size={16} /> View
                        </button>
                        <button className="p-1.5 text-orange-600 hover:bg-orange-50 rounded flex items-center gap-1 text-sm font-medium">
                          <Edit size={16} /> Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Rows Limit */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center gap-4 text-sm text-gray-600">
          <span>Rows:</span>
          <div className="flex gap-2">
            {[10, 20, 50].map((num) => (
              <button 
                key={num}
                onClick={() => setLimit(num)}
                className={`px-3 py-1 rounded border ${limit === num ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:bg-gray-100'}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;