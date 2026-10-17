import React, { useState, useEffect } from 'react';
import { Download, Filter, ChevronLeft, ChevronRight, List } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Transaction = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [statusFilter, setStatusFilter] = useState('All Statuses');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchTransactions = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/transactions?page=${page}&status=${statusFilter}`);
                setTransactions(response.data.transactions);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                toast.error("Failed to load transactions");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, [page, statusFilter]);

    // CSV Export ko naye schema ke hisaab se update kiya
    const handleExportCSV = () => {
        if (transactions.length === 0) return toast.error("No data to export");

        const headers = ["Wallet", "Type", "Amount", "Status", "Hash ID", "Description", "Date"];
        const csvRows = [headers.join(',')];

        transactions.forEach(t => {
            const row = [
                t.wallet,
                t.type,
                t.amount,
                t.status,
                t.hashId || 'N/A',
                `"${t.description}"`, 
                new Date(t.createdAt).toLocaleString()
            ];
            csvRows.push(row.join(','));
        });

        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Transactions_${new Date().toLocaleDateString()}.csv`;
        a.click();
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6">
            
            <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <List className="text-yellow-500" /> Transactions
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">Every movement across your wallets, in one ledger.</p>
                </div>
                
                <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors"
                >
                    <Download size={16} /> Export CSV
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex items-center gap-3">
                <Filter size={18} className="text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filter by status:</span>
                <select 
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                    className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-yellow-500 font-medium"
                >
                    <option>All Statuses</option>
                    <option>PENDING</option>
                    <option>COMPLETED</option>
                    <option>REJECTED</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-900 font-semibold border-b border-gray-200">
                            <tr>
                                {/* Naye Schema ke columns */}
                                <th className="px-6 py-4 whitespace-nowrap">Wallet</th>
                                <th className="px-6 py-4 whitespace-nowrap">Type</th>
                                <th className="px-6 py-4 whitespace-nowrap">Amount</th>
                                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 whitespace-nowrap">Hash / UTR</th>
                                <th className="px-6 py-4 min-w-[250px]">Description</th>
                                <th className="px-6 py-4 whitespace-nowrap">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-10 text-gray-500 font-medium">No transactions found</td>
                                </tr>
                            ) : (
                                transactions.map((t, index) => (
                                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-bold text-gray-900">{t.wallet}</td>
                                        <td className="px-6 py-4 font-medium text-blue-600">{t.type}</td>
                                        {/* Agar amount minus me hai toh red, plus me hai toh green dikhayega */}
                                        <td className={`px-6 py-4 font-bold ${t.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                            {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                                t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {t.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-gray-500">{t.hashId}</td>
                                        <td className="px-6 py-4 text-gray-600">{t.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-xs font-medium">
                                            {new Date(t.createdAt).toLocaleString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {!loading && totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <span className="text-sm text-gray-500 font-medium">
                            Page {page} of {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                            >
                                <ChevronLeft size={16} /> Previous
                            </button>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
                            >
                                Next <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transaction;