import  { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { Copy, CheckCircle2, TrendingUp, Wallet, Users, Activity, ExternalLink } from 'lucide-react';
const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/user/dashboard');
        setData(res.data);
      } catch (error) {
        toast.error("Failed to load dashboard data");
        console.log(error.message)
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

const handleCopy = (text, type) => {
    // Agar api abhi aayi nahi hai ya link nahi bani hai toh rok do
    if (!text) {
      toast.error("Loading data, please wait...");
      return;
    }
  
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        toast.success("Referral Link copied!");
      } else {
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
        toast.success("Golden ID copied!");
      }
    }).catch(() => toast.error("Failed to copy!"));
  };
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><p className="text-gray-500 font-medium text-lg">Loading your dashboard...</p></div>;
  }

  if (!data || !data.user) {
    return <div className="p-6 text-center text-red-500">Error loading data. Please try logging in again.</div>;
  }

  const { user, recentTransactions ,activeBanners } = data;
  const progressPercent = user.roiTarget > 0 ? (user.roiCompleted / user.roiTarget) * 100 : 0;
  const remainingTarget = user.roiTarget - user.roiCompleted;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 w-full font-sans">
      
      {/* Header Profile Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 flex items-center gap-2">
          Welcome back, <span className="font-semibold text-gray-700">{user.name}</span>
          <span className="bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full font-mono">LEADERID · {user.goldenId}</span>
        </p>
      </div>

      {/* Alert / Notice Banner */}


      {activeBanners && activeBanners.length > 0  &&  (
        <div className='mb-8 space-y-4'>
          {activeBanners.map((banner) => (
            <div key={banner._id} className="bg-blue-50 border border-blue-200 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center shadow-sm">
              {/* Agar Admin ne image lagayi hai to image dikhegi, warna icon */}
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <CheckCircle2 className="text-blue-500 flex-shrink-0" size={24} />
              )}
              
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 text-lg">{banner.title}</h3>
                {/* Yahan aap aage chalkar description add kar sakti hain Content model me, abhi ke liye link de dete hain */}
                {banner.link && (
                  <a href={banner.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm mt-1 hover:underline inline-block">
                    Click here for more details &rarr;
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2-Column Grid for Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Referral Box (Takes 1 Col) */}
<div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-lg font-semibold text-gray-800">Referral link</h3>
          <p className="text-sm text-gray-500 mb-6">Share this link to grow your network</p>
          
          <div className="space-y-4">
            {/* Referral Link Input & Copy */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Your invite link</label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-gray-50 focus-within:ring-2 ring-blue-100 transition-all">
                <input 
                  type="text" 
                  readOnly 
                  // 💡 Frontend par direct link generate kar rahe hain taaki koi missing param na ho
                  value={user?.goldenId ? `${window.location.origin}/register?referral=${user.goldenId}` : 'Loading...'} 
                  className="flex-1 bg-transparent p-2.5 text-sm outline-none text-gray-600 truncate" 
                />
                <button 
                  onClick={() => {
                    // Seedha generated link ko copy karo
                    const fullLink = user?.goldenId ? `${window.location.origin}/register?referral=${user.goldenId}` : '';
                    handleCopy(fullLink, 'link');
                  }} 
                  className="px-4 border-l border-gray-300 font-medium text-blue-600 hover:bg-blue-50 transition text-sm"
                >
                  {copiedLink ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Golden ID Input & Copy */}
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 block">Your login ID</label>
              <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-gray-50 focus-within:ring-2 ring-blue-100 transition-all">
                <input 
                  type="text" 
                  readOnly 
                  value={user?.goldenId || 'Loading...'} 
                  className="flex-1 bg-transparent p-2.5 font-mono text-sm outline-none text-gray-700 font-semibold" 
                />
                <button 
                  onClick={() => handleCopy(user?.goldenId, 'id')} 
                  className="px-4 border-l border-gray-300 font-medium text-blue-600 hover:bg-blue-50 transition text-sm"
                >
                  {copiedId ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* ROI Target Progress Card (Takes 2 Cols) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 md:p-8 text-white shadow-md relative overflow-hidden flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={120} />
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-2">
              <div>
                <span className="text-yellow-400 font-semibold text-sm tracking-wider uppercase mb-1 block">Current cycle · 3X</span>
                <h3 className="text-2xl font-bold">Income towards your ROI cap</h3>
              </div>
            </div>
            
            <div className="mt-8 mb-4">
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-3xl font-bold text-white">${user.roiCompleted?.toLocaleString(undefined, {minimumFractionDigits: 4})}</span>
                <span className="text-gray-400 text-sm">/ ${user.roiTarget?.toLocaleString(undefined, {minimumFractionDigits: 2})} target</span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-3 w-full bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${Math.min(progressPercent, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-yellow-400 font-medium">{progressPercent.toFixed(1)}% completed</span>
                <span className="text-gray-300">${Math.max(remainingTarget, 0).toLocaleString(undefined, {minimumFractionDigits: 4})} remaining</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Wallets and Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        
        {/* Wallet Cards */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg"><Wallet size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Main Wallet</p>
            <p className="text-xl font-bold text-gray-900">${user.mainWallet?.toFixed(4) || '0.0000'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-lg"><Activity size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Trade Wallet</p>
            <p className="text-xl font-bold text-gray-900">${user.tradeWallet?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">My Investment</p>
            <p className="text-xl font-bold text-gray-900">${user.myInvestment?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg"><Wallet size={24} /></div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Generation Wallet</p>
            <p className="text-xl font-bold text-gray-900">${user.generationWallet?.toFixed(4) || '0.0000'}</p>
          </div>
        </div>

        {/* Network Stats Cards */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-1.5"><Users size={16}/> Team Turnover</p>
          <p className="text-2xl font-bold text-gray-900">${user.teamTurnover?.toLocaleString(undefined, {minimumFractionDigits: 4}) || '0.0000'}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Power Leg</p>
          <p className="text-2xl font-bold text-gray-900">${user.powerLeg?.toLocaleString(undefined, {minimumFractionDigits: 4}) || '0.0000'}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1">Other Leg</p>
          <p className="text-2xl font-bold text-gray-900">${user.otherLeg?.toLocaleString(undefined, {minimumFractionDigits: 2}) || '0.00'}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium mb-1 text-purple-600">Referral Bonus</p>
          <p className="text-2xl font-bold text-gray-900">${user.referralBonus?.toFixed(2) || '0.00'}</p>
        </div>

      </div>

      {/* 3 Summary Big Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl p-6 text-white shadow-md">
          <p className="text-blue-100 font-medium mb-1">Total Income</p>
          <h3 className="text-3xl font-bold mb-2">${user.totalIncome?.toLocaleString(undefined, {minimumFractionDigits: 4}) || '0.0000'}</h3>
          <p className="text-xs text-blue-200">Lifetime earnings across all reward streams</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium mb-1">Total Withdrawal</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">${user.totalWithdrawal?.toFixed(2) || '0.00'}</h3>
          <p className="text-xs text-gray-400">Lifetime withdrawals from your account</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <p className="text-gray-500 font-medium mb-1">New Business</p>
          <h3 className="text-3xl font-bold text-gray-900 mb-2">${user.newBusiness?.toFixed(2) || '0.00'}</h3>
          <p className="text-xs text-gray-400">Network investments this cycle</p>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent transactions</h2>
            <p className="text-sm text-gray-500">Your latest account activity</p>
          </div>
          <button className="text-blue-600 text-sm font-medium hover:underline flex items-center gap-1">
            View All <ExternalLink size={14} />
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Description</th>
                <th className="px-6 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded border border-blue-100">
                        {tx.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900">${tx.amount?.toFixed(4)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${
                        tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                        tx.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.description || `Transaction ID: ${tx._id.substring(0,8)}`}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{new Date(tx.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No transactions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;