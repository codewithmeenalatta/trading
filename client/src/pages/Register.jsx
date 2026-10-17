import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {  Users, Mail, Lock, User  } from 'lucide-react';
import api from '../api/axios.js';
import { useEffect } from 'react';

const Register = () => {
    const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', referralCode: ''  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const refCode = searchParams.get('referral');
    if(refCode){
      setFormData((prev) => ({
        ...prev,
        referralCode : refCode
      })) ;
    }
  } , [searchParams])

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // 🟢 DATA CLEANUP BEFORE SENDING TO BACKEND
      const dataToSend = {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          // Agar referral code khali hai (ya sirf spaces hain), toh usko 'null' bhejo
          referralCode: formData.referralCode.trim() === "" ? null : formData.referralCode.trim()
      };

      const res = await api.post('/auth/register', dataToSend);
      toast.success(res.data.message || "Registration Successful!");
      navigate('/'); // Register hone ke baad Login page par bhej do
    } catch (error) {
      console.error("Register error:", error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-500 mt-2">Join our premium trading platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <User className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input type="text" name="name" placeholder="Full Name" required onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input type="email" name="email" placeholder="Email Address" required onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input type="password" name="password" placeholder="Login Password" required onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" />
          </div>

{/* Transaction Password Hata Kar Referral Code Laga Diya */}
          <div className="relative">
            <Users className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              name="referralCode" 
              placeholder="Referral Code (Optional)" 
              value={formData.referralCode || ''} 
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all" 
            />
          </div>

          <button disabled={loading} type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30">
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/" className="text-blue-600 font-semibold hover:underline">Log In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;