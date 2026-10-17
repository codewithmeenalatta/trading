import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar'; 

const AdminLayout = () => {
  // 1. State yahan banegi
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans overflow-hidden">
      
      {/* 2. State ko Sidebar ko bhej rahe hain (props ke zariye) */}
      <div className="fixed inset-y-0 left-0 z-50">
        <AdminSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* 3. Main content jo sidebar ke band/khulne par adjust hoga */}
      <div className={`flex-1 flex flex-col w-full min-w-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-[80px]' : 'ml-[256px]'}`}>
        <header className="h-16 bg-white shadow-sm flex items-center px-6 border-b border-gray-200 sticky top-0 z-40">
          <h2 className="text-xl font-semibold text-gray-800">Admin Control Center</h2>
        </header>
        <main className="flex-1 p-4 md:p-6 pb-20 overflow-x-hidden min-w-0">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;