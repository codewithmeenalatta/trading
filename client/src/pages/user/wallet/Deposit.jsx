import  { useState } from 'react';
import {  Copy, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../../api/axios'; // Dhyan rakhein ki aapka axios ka path yahi ho

const Deposit = () => {
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState(1); // 1: Amount form, 2: QR & Hash form
    
    // Backend se aane wala data
    const [depositData, setDepositData] = useState(null); 
    const [hashId, setHashId] = useState('');
    const [loading, setLoading] = useState(false);

    // =====================================
    // BACKEND LOGIC: Generate QR
    // =====================================
    const handleGenerate = async (e) => {
        e.preventDefault();
        if (Number(amount) < 10) return toast.error("Minimum deposit is 10 USDT");

        setLoading(true);
        try {
            // Dynamic Backend Call (Apne banaye API par)
            const response = await api.post('/wallet/deposit/request', { amount });
            setDepositData(response.data); // Isme transactionId aur payAddress aayega
            toast.success("QR Code & Address Generated!");
            setStep(2);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to generate address");
        } finally {
            setLoading(false);
        }
    };

    // =====================================
    // BACKEND LOGIC: Submit Hash
    // =====================================
    const handleSubmitHash = async (e) => {
        e.preventDefault();
        if (!hashId) return toast.error("Please enter Transaction Hash");

        setLoading(true);
        try {
            await api.post('/wallet/deposit/submit-hash', {
                transactionId: depositData.transactionId,
                hashId: hashId
            });
            toast.success("Deposit submitted! Waiting for Admin approval.");
            
            // Wapas pehle jaisa kar do
            setStep(1); 
            setAmount(''); 
            setHashId(''); 
            setDepositData(null);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit hash");
        } finally {
            setLoading(false);
        }
    };

    // Address Copy Function
    const copyAddress = () => {
        if (depositData?.payAddress) {
            navigator.clipboard.writeText(depositData.payAddress);
            toast.success("Address Copied!");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
            {/* Back Button (Optional, achha UI experience deta hai) */}
            <Link to="/user/wallet" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors font-medium">
                <ArrowLeft size={18} /> Back to Wallet
            </Link>

            {/* Header Section - Exactly matching your UI */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                     Deposit
                </h1>
                <p className="text-gray-500 mt-2 text-sm sm:text-base">
                    Add USDT to your trade wallet over BNB Smart Chain (BEP20).
                </p>
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 p-6 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-800">Deposit details</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose the destination wallet, network and amount.</p>
                </div>

                <div className="p-6 sm:p-8">
                    
                    {/* =======================================================
                        STEP 1: AMOUNT ENTRY FORM (As per your exact design)
                    ======================================================= */}
                    {step === 1 && (
                        <form onSubmit={handleGenerate} className="space-y-6">
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Deposit wallet</label>
                                    <input 
                                        type="text" 
                                        value="Trade wallet" 
                                        disabled 
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 font-medium cursor-not-allowed" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Network</label>
                                    <input 
                                        type="text" 
                                        value="BINANCE BEP20" 
                                        disabled 
                                        className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-lg text-gray-600 font-medium cursor-not-allowed" 
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Amount (USDT)</label>
                                <input 
                                    type="number" 
                                    min="10" 
                                    required 
                                    value={amount} 
                                    onChange={(e) => setAmount(e.target.value)} 
                                    placeholder="0.00" 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold transition-all" 
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || !amount} 
                                className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="animate-spin h-5 w-5 border-b-2 border-white rounded-full"></div> Processing...
                                    </span>
                                ) : (
                                    "Generate QR & Address"
                                )}
                            </button>
                        </form>
                    )}

                    {/* =======================================================
                        STEP 2: SHOW QR & HASH INPUT (Comes from Backend)
                    ======================================================= */}
                    {step === 2 && depositData && (
                        <form onSubmit={handleSubmitHash} className="space-y-6">
                            
                            <div className="flex flex-col items-center p-6 border border-gray-200 rounded-xl bg-gray-50">
                                <p className="text-sm font-semibold text-gray-600 mb-4">
                                    Send exactly <span className="text-blue-600 font-bold text-xl">{amount} USDT</span>
                                </p>
                                
                                {/* Dynamic QR Code from free API using backend address */}
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${depositData.payAddress}`} 
                                    alt="Deposit QR" 
                                    className="rounded-lg shadow-sm border border-gray-200 p-2 bg-white mb-6" 
                                />
                                
                                <div className="w-full max-w-md">
                                    <label className="block text-xs font-semibold text-gray-500 mb-2">Deposit Address</label>
                                    <div className="flex items-center justify-between gap-2 bg-white p-3 rounded-lg border border-gray-300 shadow-sm">
                                        <p className="text-sm font-mono text-gray-800 truncate">{depositData.payAddress}</p>
                                        <button 
                                            type="button" 
                                            onClick={copyAddress} 
                                            className="text-gray-500 hover:text-blue-600 transition-colors p-1"
                                        >
                                            <Copy size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Submit Hash / UTR</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={hashId} 
                                    onChange={(e) => setHashId(e.target.value)} 
                                    placeholder="Enter your transaction hash here..." 
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm" 
                                />
                                <p className="text-xs text-gray-500 mt-2">After completing the transfer, paste the transaction hash to verify your deposit.</p>
                            </div>

                            <div className="flex gap-4">
                                <button 
                                    type="button" 
                                    onClick={() => setStep(1)} 
                                    className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading || !hashId} 
                                    className="flex-1 flex justify-center items-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                >
                                    {loading ? "Submitting..." : <><CheckCircle size={20} /> Verify Payment</>}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Deposit;