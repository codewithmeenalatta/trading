import  { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../api/axios'; // Apna sahi path check kar lein

const Withdraw = () => {
    // 🟢 DYNAMIC DATA STATE (Backend se aayega)
    const [balances, setBalances] = useState({ mainBalance: 0, affiliateBalance: 0 });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    // 🟢 FORM STATE
    const [walletType, setWalletType] = useState('');
    const [amount, setAmount] = useState('');
    const [cryptoAddress, setCryptoAddress] = useState(''); // Backend ke liye zaroori hai
    const [transactionPassword, setTransactionPassword] = useState('');

    // Backend se user ka actual balance lana
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await api.get('/wallet/balance');
                setBalances(response.data);
            } catch (error) {
                toast.error("Failed to load balances");
                console.error(error.message)
            } finally {
                setLoading(false);
            }
        };
        fetchBalance();
    }, []);

    const handleWithdraw = async (e) => {
        e.preventDefault();
        
        // Validations
        if (!walletType) return toast.error("Please select a wallet to withdraw from.");
        if (Number(amount) < 10) return toast.error("Minimum withdrawal is $10");
        if (Number(amount) > 50) return toast.error("Maximum withdrawal is $50 per request");
        if (Number(amount) > balances[walletType]) return toast.error("Insufficient balance in selected wallet!");
        if (!transactionPassword) return toast.error("Transaction password is required");
        if (!cryptoAddress) return toast.error("Destination address is required");

        setSubmitting(true);
        try {
            // Backend ko dynamic data bhej rahe hain
            const response = await api.post('/wallet/withdraw/request', {
                amount: Number(amount),
                walletType: walletType,
                cryptoAddress: cryptoAddress,
                transactionPassword: transactionPassword // (Agar backend me verify karna ho)
            });

            toast.success(response.data.message || "Withdrawal request submitted!");
            
            // Form reset karein aur local balance update karein
            setAmount(''); 
            setCryptoAddress('');
            setTransactionPassword('');
            setBalances(prev => ({ ...prev, [walletType]: prev[walletType] - Number(amount) }));
        } catch (error) {
            toast.error(error.response?.data?.message || "Withdrawal failed");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 rounded-full"></div>
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            <Link to="/user/wallet" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Back to Wallet
            </Link>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Withdraw</h1>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Request a withdrawal from your main or affiliate wallet.
                </p>
            </div>

            {/* 🟢 DYNAMIC WALLET CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 font-semibold mb-1 text-sm">Main wallet</p>
                    {/* Database se balance aa raha hai */}
                    <h3 className="text-2xl font-bold text-gray-900">${balances.mainBalance.toFixed(2)}</h3>
                    <p className="text-xs text-green-600 font-medium mt-1">Available to withdraw</p>
                </div>
                
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-gray-500 font-semibold mb-1 text-sm">Affiliate wallet</p>
                    {/* Database se balance aa raha hai */}
                    <h3 className="text-2xl font-bold text-gray-900">${balances.affiliateBalance.toFixed(2)}</h3>
                    <p className="text-xs text-green-600 font-medium mt-1">Available to withdraw</p>
                </div>
            </div>

            {/* Withdrawal Form Area */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Notice Box */}
                <div className="bg-blue-50/50 p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        Withdrawal request
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        Requests are reviewed before funds are released.<br/>
                        Withdrawals are limited to one request every 24 hours, between <strong>$10 and $50</strong> per request.
                    </p>
                </div>

                <div className="p-6 sm:p-8">
                    <form onSubmit={handleWithdraw} className="space-y-6">
                        
                        {/* SELECT WALLET */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Withdraw from wallet</label>
                            <select 
                                required
                                value={walletType}
                                onChange={(e) => setWalletType(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium text-gray-700"
                            >
                                <option value="" disabled>Select --</option>
                                <option value="mainBalance">Main Wallet</option>
                                <option value="affiliateBalance">AFFILIATE Wallet</option>
                            </select>
                        </div>

                        {/* AMOUNT INPUT */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount to withdraw</label>
                            <input 
                                type="number" 
                                required 
                                min="10"
                                max="50"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Min $10 – Max $50" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-semibold"
                            />
                        </div>

                        {/* CRYPTO ADDRESS (Added because your backend requires it to send funds) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Destination Crypto Address</label>
                            <input 
                                type="text" 
                                required 
                                value={cryptoAddress}
                                onChange={(e) => setCryptoAddress(e.target.value)}
                                placeholder="Enter your receiving wallet address" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                            />
                        </div>

                        {/* TRANSACTION PASSWORD (As per your UI design) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Transaction password</label>
                            <input 
                                type="password" 
                                required 
                                value={transactionPassword}
                                onChange={(e) => setTransactionPassword(e.target.value)}
                                placeholder="Enter transaction password" 
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="pt-2">
                            <button 
                                type="submit" 
                                disabled={submitting} 
                                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div> Processing...
                                    </span>
                                ) : (
                                    "Confirm Withdrawal"
                                )}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default Withdraw;