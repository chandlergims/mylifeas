'use client';

import { useState, useEffect } from "react";
import { ToastContainer } from 'react-toastify';
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  // Close sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <div className="min-h-screen bg-[#e9e3d9]">
      <Navbar toggleSidebar={toggleSidebar} />
      
      <div className="flex">
        {/* Sidebar */}
        <div className={`
          fixed md:sticky top-0 h-screen shrink-0
          ${sidebarOpen ? 'w-56' : 'w-16'} 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          bg-[#e9e3d9] border-r border-[#d0c3b1] 
          transition-all duration-300 z-40
        `}>
          <button 
            onClick={toggleSidebar}
            className="absolute -right-3 top-6 bg-[#e9e3d9] rounded-full p-1.5 border border-[#d0c3b1] hover:shadow-sm transition-shadow hidden md:block"
          >
            <svg 
              stroke="currentColor" 
              fill="currentColor" 
              strokeWidth="0" 
              viewBox="0 0 320 512" 
            className={`w-3 h-3 transition-transform duration-300 ${sidebarOpen ? '' : 'rotate-180'}`} 
              height="1em" 
              width="1em" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path>
            </svg>
          </button>
          
          <div className="h-full overflow-y-auto hide-scrollbar">
            {/* Terminal Section */}
            <div className="py-6">
              {sidebarOpen && <h2 className="text-sm text-[#f0b90b] px-4 mb-2">Terminal</h2>}
              <div className="space-y-1">
                <div className="relative">
                  <Link href="/" className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#d0c3b1]/30 cursor-pointer text-gray-600 ${!sidebarOpen && 'justify-center'}`}>
                    <svg className="w-6 h-6 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    {sidebarOpen && <span className="text-sm font-medium">Home</span>}
                  </Link>
                </div>
                <div className="relative">
                  <Link href="/docs" className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#d0c3b1]/30 cursor-pointer text-gray-600 ${!sidebarOpen && 'justify-center'}`}>
                    <svg className="w-6 h-6 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {sidebarOpen && <span className="text-sm font-medium">Docs</span>}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* You Section */}
            <div className="py-6">
              {sidebarOpen && <h2 className="text-sm text-[#f0b90b] px-4 mb-2">You</h2>}
              <div className="space-y-1">
                <div className="relative">
                  <Link href="/profile" className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#d0c3b1]/30 cursor-pointer text-gray-600 ${!sidebarOpen && 'justify-center'}`}>
                    <svg className="w-6 h-6 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    {sidebarOpen && <span className="text-sm font-medium">Profile</span>}
                  </Link>
                </div>
                <div className="relative">
                  <Link href="/create" className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#d0c3b1]/30 cursor-pointer text-gray-600 ${!sidebarOpen && 'justify-center'}`}>
                    <svg className="w-6 h-6 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {sidebarOpen && <span className="text-sm font-medium">Create My Life As</span>}
                  </Link>
                </div>
                <div className="relative">
                  <Link href="/rewards" className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#d0c3b1]/30 cursor-pointer text-gray-600 ${!sidebarOpen && 'justify-center'}`}>
                    <svg className="w-6 h-6 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {sidebarOpen && <span className="text-sm font-medium">Rewards</span>}
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Sponsors Section */}
            <div className="py-6">
              {sidebarOpen && <h2 className="text-sm text-[#f0b90b] px-4 mb-2">Sponsors</h2>}
              <div className="space-y-1">
                <div className="relative">
                  <button 
                    onClick={() => {
                      // Import dynamically to avoid issues with SSR
                      import('@/utils/toast').then(({ showInfo }) => {
                        showInfo('Coming soon!');
                      });
                    }}
                    className={`flex items-center gap-3 px-4 py-2.5 hover:bg-[#d0c3b1]/30 cursor-pointer text-gray-600 ${!sidebarOpen && 'justify-center'} w-full text-left`}
                  >
                    <svg className="w-6 h-6 min-w-[1.25rem]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {sidebarOpen && <span className="text-sm font-medium">Become a Sponsor</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1">
          <div className="p-6">
            {children}
            <ToastContainer />
          </div>
        </main>
      </div>
    </div>
  );
}
