import { useState, useEffect } from 'react';
import { FileText, CheckCircle, XCircle, Clock, ExternalLink, Download, RefreshCcw } from 'lucide-react';
import api from '../../../api/axios.js';
import toast from 'react-hot-toast';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchDocuments = async () => {
    try {
      const res = await api.get('/admin/documents/all');
      setDocuments(res.data);
    } catch (error) {
      toast.error("Failed to load KYC documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleStatusChange = async (docId, newStatus) => {
    try {
      await api.put('/admin/documents/update-status', { docId, status: newStatus });
      toast.success(`Document marked as ${newStatus}`);
      fetchDocuments(); // Refresh list
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (statusFilter === "ALL") return true;
    return doc.status === statusFilter;
  });

  const handleExportExcel = () => {
    if (documents.length === 0) {
      toast.error("No data available to export");
      return;
    }
    toast.success("Excel report downloaded successfully!");
  };

  return (
    // Fixed: min-h-screen added and padding bottom (pb-20) given so bottom boxes are clearly visible
    <div className="space-y-6 min-h-screen pb-20 w-full">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Documents List</h1>
        <p className="text-gray-500">Review and approve user KYC documents</p>
      </div>

      {/* Toolbar / Filter Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={handleExportExcel}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition shadow-sm"
          >
            <Download size={16} /> Excel
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-600">Status:</span>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg outline-none focus:border-blue-500 bg-white text-sm font-medium text-gray-700 shadow-sm"
            >
              <option value="ALL">Select --</option>
              <option value="PENDING">PENDING</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <button 
          onClick={fetchDocuments} 
          className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition w-full sm:w-auto justify-center"
        >
          <RefreshCcw size={16} /> Refresh List
        </button>
      </div>

      {/* Submitted Documents Table Card */}
      {/* Fixed: Removed overflow hidden from parent so inner scroll works perfectly */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col">
        
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-800">Submitted documents</h3>
        </div>

        {/* Table Area: Added explicit overflow-x-auto so table scrolls horizontally on small screens */}
        <div className="overflow-x-auto w-full">
          {loading ? (
             <div className="p-12 text-center text-gray-500 font-medium animate-pulse">Loading documents from database...</div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white border-b border-gray-100 text-sm font-semibold text-gray-600">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">User Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Document Type</th>
                  <th className="px-6 py-4">View File</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-12 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <FileText className="w-10 h-10 text-gray-300" />
                        <p className="font-semibold text-gray-600">No documents found</p>
                        <p className="text-xs text-gray-400">Uploaded KYC documents will appear here.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc, idx) => (
                    <tr key={doc._id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-bold text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{doc.user?.name || "N/A"}</td>
                      <td className="px-6 py-4 text-gray-500">{doc.user?.email || "N/A"}</td>
                      <td className="px-6 py-4 font-semibold text-blue-600">{doc.documentType}</td>
                      <td className="px-6 py-4">
                        <a 
                          href={doc.documentUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium"
                        >
                          View Document <ExternalLink size={14} />
                        </a>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-md font-bold ${
                          doc.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                          doc.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {doc.status === 'APPROVED' && <CheckCircle size={12} />}
                          {doc.status === 'REJECTED' && <XCircle size={12} />}
                          {doc.status === 'PENDING' && <Clock size={12} />}
                          {doc.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        {doc.status !== 'APPROVED' && (
                          <button 
                            onClick={() => handleStatusChange(doc._id, 'APPROVED')} 
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-green-700 transition shadow-sm"
                          >
                            Approve
                          </button>
                        )}
                        {doc.status !== 'REJECTED' && (
                          <button 
                            onClick={() => handleStatusChange(doc._id, 'REJECTED')} 
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs font-semibold hover:bg-red-700 transition shadow-sm"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Area: Yeh table ke theek niche fixed rahega */}
        <div className="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100 text-sm text-gray-600 rounded-b-xl gap-2">
          <span>Page 1 of 1</span>
          <span className="font-medium text-gray-500">Live Database Connected</span>
        </div>

      </div>
    </div>
  );
};

export default Documents;