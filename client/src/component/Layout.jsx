import React from 'react';
import { Outlet } from 'react-router-dom';
// Agar aapke paas Navbar aur Footer alag se bane hain toh unko import karein
import Navbar from './Navbar'; 
import Footer from './Footer'; 

const Layout = () => {
  return (
    // min-h-screen aur flex-col ye ensure karte hain ki footer hamesha neeche rahega
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      
      {/* 1. Upar Navbar (Sirf in public pages ke liye) */}
      <Navbar />
      
      {/* 2. Beech mein Main Content (Jaise Login, Register ya Landing page) */}
      <main className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet /> 
      </main>
      
      {/* 3. Sabse neeche Footer */}
      <Footer />
      
    </div>
  );
};

export default Layout;