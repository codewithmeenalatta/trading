import { useState , useEffect} from "react";
import { Wallet, ShieldAlert, KeyRound, CheckCircle2, AlertTriangle } from 'lucide-react';
import toast from "react-hot-toast";
import api from "../../../api/axios";
const WalletAddress = () => {
    const [WalletAddress , setWalletAddress ] = useState('');
    const [ transactionPassword , setTransactionPassword] = useState('');
    const [ isFetching , setIsFetching] = useState(true);
    const [ isSaving , setIsSaving] = useState(false);

    useEffect(()=> {
        const fetchWallet = async () => {
            try {
                console.log("Wallet Page: Backend ko request bhej raha hai...");
                const response = await api.get('/profile');
                console.log("Wallet Page: Data aa gaya!", response.data);
                if(response.data.user?.usdtBep20Address){
                    setWalletAddress(response.data.user.usdtBep20Address);
                }
                setIsFetching(false);
            } catch (error) {
                console.error("Fetch Wallet Error:" , error);
                toast.error("Failed to load wallet details");
                setIsFetching(false);
            }
        };
        fetchWallet();
    } , []);

    // 2. Naya Wallet Address Save karne ka function
    const handleSaveWallet = async (e) => {
        e.preventDefault();
        if(!WalletAddress || !transactionPassword){
            return toast.error("Plaese fill in both fileds")
        }

        // Basic address validation (Optional - check if it starts with 0x)

        // if(!WalletAddress.startsWith("0x") || WalletAddress.length !== 42){
        //     return toast.error("Invalid BEP20 Address. It should start with 0x and be 42 characters long.")
        // }

        setIsSaving(true);
        try {
            const response = await api.put("/profile/wallet" , {
                WalletAddress , 
                transactionPassword
            });

            toast.success(response.data.message || "Wallet Address saved sucessfully!");
            setTransactionPassword('');
        } catch (error) {
            console.error("save Wallet Error:" , error);
            toast.error(error.response?.data?.message || "Failed to update wallet address")
        }finally{
            setIsSaving(false);
        }
    }

    if(isFetching){
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            </div>
        )
    };

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-6">
      
      {/* 🟢 Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Wallet className="text-yellow-500" /> Wallet Address
        </h1>
        <p className="text-gray-500 mt-2">
          Set the USDT (BEP20) address used for your withdrawals.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 Left Side: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Payout Wallet Address</h2>
            <p className="text-sm text-gray-500 mb-6">
              Withdrawals are sent to this address — double-check it before saving.
            </p>

            <form onSubmit={handleSaveWallet} className="space-y-5">
              
              {/* Network (Readonly) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Network</label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 font-medium flex items-center gap-2 cursor-not-allowed">
                  <CheckCircle2 size={18} className="text-green-500" /> USDT (BEP20)
                </div>
              </div>

              {/* Wallet Address Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wallet Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Wallet size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={WalletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Transaction Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter transaction password"
                    value={transactionPassword}
                    onChange={(e) => setTransactionPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <ShieldAlert size={14} className="text-yellow-600" /> 
                  Wallet changes are protected by your transaction password.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gray-900 hover:bg-gray-800 text-yellow-500 font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                ) : (
                  "Save Wallet Address"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 🟢 Right Side: Warning Banner */}
        <div className="lg:col-span-1">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-yellow-800">Send BEP20 assets only</h3>
                <p className="text-sm text-yellow-700 mt-2 leading-relaxed">
                  Only <strong>USDT</strong> on the <strong>BNB Smart Chain (BEP20)</strong> network is supported. Funds sent to the wrong network cannot be recovered.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
    
};

export default WalletAddress;