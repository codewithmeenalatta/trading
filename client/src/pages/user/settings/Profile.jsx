import  { useState , useEffect} from "react";
import { ShieldCheck, Mail, Lock, Save, User as UserIcon } from 'lucide-react';
import api from "../../../api/axios";
import toast from "react-hot-toast";
const Profile = () =>{
    const [ activeTab , setActiveTab] = useState('personal');
    const [ user , setUser] = useState(null);
    const [ loading , setLoading] = useState(true);
    // form state
    const [ profileData , setProfileData ] = useState({ name : "" , mobile: "" , email : ""});
    const [ passwordData , setPasswordData] = useState({ oldPassword : '' , newPassword : '' , confirmPassword : ''});
    // component lad hote hi backend s data fetch karne k liye
useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log("Backend ko request bhej raha hai..."); // Ise upar kiya hai
        
        // Agar axios base URL me '/api' nahi hai, toh ise '/api/profile' kar dein
        const response = await api.get('/profile'); 
        const userData = response.data.user;

        setUser(userData);
        setProfileData({
          name: userData.name || '',
          mobile: userData.mobile || '', // Yahan email ki jagah mobile kiya
          email: userData.email || ''
        });
        
        setLoading(false);
        console.log("Data successfully aa gaya!", userData);
        
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        toast.error("Failed to load Profile data");
        setLoading(false);
      }
    };

    // 🔴 SABSE ZAROORI: Yahan function ko call karna zaroori hai!
    fetchProfile(); 
    
  }, []);

    // personal info update handler
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put('/profile' , {
                name : profileData.name , 
                mobile : profileData.mobile
            });
            setUser(response.data.user);
            toast.success(response.data.message || "Profile Update Sucessfully!")
            
        } catch (error) {
            toast.error(error.response?.data?.message || "Profile Update Failed!");
        }
    };

    // Passowrd {Login / Transaction}update handler
const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if(passwordData.newPassword !== passwordData.confirmPassword){
            return toast.error("New Password and confim password do not match!");
        }

        try {
            // 🟢 NAYA CODE: activeTab (login/transaction) ka pehla letter capital (Login/Transaction) karna
            const formattedType = activeTab.charAt(0).toUpperCase() + activeTab.slice(1);

            const response = await api.put('/profile/password' , {
                type : formattedType, // 👈 Yahan update kiya hai
                oldPassword : passwordData.oldPassword,
                newPassword : passwordData.newPassword
            });
            toast.success(response.data.message);
            setPasswordData({ oldPassword : '' , newPassword : '' , confirmPassword :''});
        } catch (error) {
            toast.error(error.response?.data?.message || "Password Update  failed")
        }
    }

    // Loading state UI
    if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    );
  }


  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-500 mt-1">Manage your profile and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 🟢 LEFT SIDE: Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
            {/* Dynamic Avatar (Pehla Letter) */}
            <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-4xl font-bold text-yellow-700 mb-5 border-4 border-white shadow-md">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={40} />}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
            
            <div className="flex items-center gap-1.5 text-green-600 text-sm font-semibold mt-2 bg-green-50 px-3 py-1 rounded-full">
              <ShieldCheck size={16} /> Verified
            </div>
            
            <div className="w-full h-px bg-gray-100 my-5"></div>
            
            <div className="flex items-center justify-center gap-2 text-gray-600 text-sm w-full">
              <Mail size={16} className="text-gray-400" /> 
              <span className="truncate">{user?.email}</span>
            </div>
          </div>
        </div>

        {/* 🟢 RIGHT SIDE: Tabs & Forms */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-100 overflow-x-auto">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'personal' ? 'border-yellow-600 text-yellow-700 bg-yellow-50/50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              >
                Personal Info
              </button>
              <button 
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'login' ? 'border-yellow-600 text-yellow-700 bg-yellow-50/50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              >
                Login Password
              </button>
              <button 
                onClick={() => setActiveTab('transaction')}
                className={`flex-1 py-4 px-4 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${activeTab === 'transaction' ? 'border-yellow-600 text-yellow-700 bg-yellow-50/50' : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
              >
                Transaction Password
              </button>
            </div>

            {/* Tab Content Area */}
            <div className="p-6 sm:p-8">
              
              {/* TAB 1: Personal Info Form */}
              {activeTab === 'personal' && (
                <form onSubmit={handleProfileUpdate} className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      disabled // Email can't be changed
                      className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-xl text-gray-500 cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-400 mt-1.5">Email address cannot be changed for security reasons.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                    <input 
                      type="text" 
                      value={profileData.mobile}
                      onChange={(e) => setProfileData({...profileData, mobile: e.target.value})}
                      placeholder="Add mobile number"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all text-gray-800"
                    />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-yellow-600 hover:bg-yellow-500 text-gray-900 font-bold rounded-xl transition-all shadow-sm hover:shadow">
                      <Save size={18} /> Save Profile Changes
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2 & 3: Passwords Form (Dono ka structure same hai, logic upar handle kiya hai) */}
              {(activeTab === 'login' || activeTab === 'transaction') && (
                <form onSubmit={handlePasswordUpdate} className="space-y-6 animate-fadeIn">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Old {activeTab === 'login' ? 'Login' : 'Transaction'} Password
                    </label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.oldPassword}
                      onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                      placeholder="Enter current password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all"
                    />
                    {activeTab === 'transaction' && (
                      <p className="text-xs text-blue-600 mt-1.5 font-medium">Leave old password empty if creating transaction password for the first time.</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input 
                      type="password" 
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      placeholder="Re-enter new password"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-yellow-500/20 focus:border-yellow-600 transition-all"
                    />
                  </div>
                  <div className="pt-2">
                    <button type="submit" className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow">
                      <Lock size={18} /> Update {activeTab === 'login' ? 'Login' : 'Transaction'} Password
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
export default Profile;