import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from './UserSidebar'; 
import Navbar from './Navbar'; 

const UserLayout = () => {
  return (
    // 'h-screen' ensures page doesn't grow beyond the screen, 'flex-col' for vertical stack
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      {/* 1. Navbar (Sticky / Fixed at the top) */}
      <div className="flex-shrink-0 z-50">
        <Navbar />
      </div>

      {/* 2. Main Area (Sidebar + Dashboard) */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Sidebar (Fixed height) */}
        <div className="flex-shrink-0 h-full">
           <UserSidebar />
        </div>
        
        {/* Right: Dashboard (Scrollable area) */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
};

export default UserLayout;