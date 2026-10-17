import  { useState } from 'react';
import { ShieldCheck, KeyRound, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
// import api from '../../../api/axios'; // Apna axios ka sahi path dalein
import api from '../../../api/axios';

const TransactionPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSavePassword = async (e) => {
    e.preventDefault();

    // 1. Check agar password match nahi ho raha
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }

    // 2. Strict Security Check (Frontend par hi rok lenge agar weak hua toh)
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    // if (!passwordRegex.test(newPassword)) {
    //   return toast.error("Please follow all password requirements.");
    // }

    setIsSaving(true);
    try {
      const response = await api.put('/profile/transaction-password', {
        newPassword
      });

      toast.success(response.data.message || "Transaction Password secured successfully!");
      
      // Save hone ke baad dono dabbe khali kar do
      setNewPassword('');
      setConfirmPassword('');
      
    } catch (error) {
      console.error("Save Password Error:", error);
      toast.error(error.response?.data?.message || "Failed to set password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      
      {/* 🟢 Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <ShieldCheck className="text-yellow-500" size={28} /> Set Transaction Password
        </h1>
        <p className="text-gray-500 mt-2">
          Your transaction password protects withdrawals and wallet changes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 Left Side: Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">Security Setup</h2>
            <p className="text-sm text-gray-500 mb-6">
              Choose a strong password you don't use anywhere else.
            </p>

            <form onSubmit={handleSavePassword} className="space-y-5">
              
              {/* New Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <KeyRound size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Enter new transaction password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-gray-900 hover:bg-gray-800 text-yellow-500 font-semibold py-3 px-4 rounded-lg transition-colors flex justify-center items-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                ) : (
                  <>
                    <ShieldCheck size={20} /> Secure My Account
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* 🟢 Right Side: Password Requirements Info Box */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-semibold text-blue-800">Password requirements</h3>
                <p className="text-sm text-blue-700 mt-3 leading-relaxed">
                  Must be at least <strong className="font-bold">8 characters</strong> and include:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> A number (0-9)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Uppercase letter (A-Z)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Lowercase letter (a-z)</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-blue-500"/> Special character (@, $, etc.)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TransactionPassword;