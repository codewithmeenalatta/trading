import  { useState, useEffect } from 'react';
import { TrendingUp, Wallet, AlertCircle, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const Trade = () => {
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [isFetching, setIsFetching] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Page load hote hi backend se real balance mangwana
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await api.get('/trade/balance');
                setBalance(response.data.availableBalance);
            } catch (error) {
                console.log(error)
                toast.error("Failed to load balance");
            } finally {
                setIsFetching(false);
            }
        };
        fetchBalance();
    }, []);

    // Max Button ka logic
    const handleMaxClick = () => {
        if (balance > 0) {
            setAmount(balance.toString());
        }
    };

    // Trade Submit karna
    const handleTradeSubmit = async (e) => {
        e.preventDefault();
        
        const tradeVal = Number(amount);
        if (tradeVal < 1) {
            return toast.error("Minimum trade amount is $1.");
        }
        if (tradeVal > balance) {
            return toast.error("Insufficient balance!");
        }

        setIsSubmitting(true);
        try {
            const response = await api.post('/trade/submit', { amount: tradeVal });
            toast.success(response.data.message);
            
            // Backend se aayi hui nayi balance update kar dena
            setBalance(response.data.newBalance);
            setAmount(''); // Input khali kar do
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Trade submission failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6">
            
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <TrendingUp className="text-yellow-500" size={32} /> Deploy Trade
                </h1>
                <p className="text-gray-500 mt-2">Deploy your trade balance into the market to start earning.</p>
            </div>

            {/* Main Trading Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                
                {/* Balance Display Section */}
                <div className="bg-gray-50 p-6 sm:p-8 border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-yellow-100 p-3 rounded-full text-yellow-600">
                            <Wallet size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Available Trade Balance</p>
                            <h2 className="text-3xl font-bold text-gray-900">${balance.toFixed(2)}</h2>
                        </div>
                    </div>
                </div>

                {/* Input Form Section */}
                <div className="p-6 sm:p-8">
                    <form onSubmit={handleTradeSubmit} className="space-y-6">
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Amount to trade (USDT)
                            </label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-gray-500 font-bold">$</span>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter amount"
                                    className="w-full pl-8 pr-20 py-4 text-lg font-medium border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-600 transition-all bg-gray-50 focus:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={handleMaxClick}
                                    className="absolute right-2 px-4 py-2 bg-yellow-100 text-yellow-700 font-bold text-sm rounded-lg hover:bg-yellow-200 transition-colors"
                                >
                                    MAX
                                </button>
                            </div>
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <AlertCircle size={12} /> Minimum trade amount is $1.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !amount || Number(amount) < 1 || Number(amount) > balance}
                            className="w-full flex justify-center items-center gap-2 py-4 px-6 bg-gray-900 hover:bg-gray-800 text-yellow-500 font-bold text-lg rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-500"></div>
                            ) : (
                                <>Confirm Trade <ArrowRight size={20} /></>
                            )}
                        </button>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Trade;