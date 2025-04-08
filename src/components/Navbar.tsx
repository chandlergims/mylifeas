'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useRef, useEffect } from 'react';

interface NavbarProps {
  toggleSidebar: () => void;
}

const Navbar = ({ toggleSidebar }: NavbarProps) => {
  const { user, isLoading, connectWallet, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format Ethereum address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-[#e9e3d9] text-gray-800 p-4 border-b border-[#d0c3b1] z-50">
      <div className="px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f0b90b] to-[#f0b90b] font-['SK Concretica'] tracking-wide">My Life As</span>
          </Link>
        </div>
        
        {/* CA Display in center */}
        <div className="flex items-center justify-center">
          <div className="flex items-center relative pl-8 py-2 bg-gradient-to-r from-[#fff8e1] to-transparent rounded-lg cursor-pointer">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#f0b90b] rounded-l-lg"></div>
            <span className="text-gray-800 font-medium mr-2">CA:</span>
            <div className="flex items-center gap-2">
              <span className="text-[#f0b90b] font-bold font-mono">
                {process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ''}
              </span>
              <button 
                onClick={() => {
                  if (process.env.NEXT_PUBLIC_CONTRACT_ADDRESS) {
                    navigator.clipboard.writeText(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS);
                    // Use toast instead of alert if available
                    import('@/utils/toast').then(({ showSuccess }) => {
                      showSuccess('Contract address copied to clipboard!');
                    }).catch(() => {
                      alert('Contract address copied to clipboard!');
                    });
                  }
                }}
                className="text-gray-500 hover:text-[#f0b90b] transition-colors"
                title="Copy contract address"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="min-w-[180px] flex justify-end">
          {isLoading ? (
            <button 
              className="bg-gray-100 text-gray-400 px-5 py-2 rounded-lg opacity-75 cursor-not-allowed font-medium"
              disabled
            >
              <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2 align-[-2px]"></span>
              Loading...
            </button>
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 bg-[#f0b90b]/10 hover:bg-[#f0b90b]/20 text-[#f0b90b] px-4 py-2 rounded-lg transition-all duration-200 font-medium border border-[#f0b90b]/20"
              >
                <span className="text-[#f0b90b] font-['Montserrat']">
                  {formatAddress(user.address)}
                </span>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-4 w-4 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#e9e3d9] rounded-lg shadow-xl py-1 z-10 border border-[#d0c3b1] overflow-hidden">
                  <div className="px-4 py-3 text-sm text-gray-600 border-b border-[#d0c3b1] bg-[#e9e3d9] font-['Montserrat']">
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-[#f0b90b]">{formatAddress(user.address)}</div>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(user.address);
                        }}
                        className="text-gray-500 hover:text-[#f0b90b] transition-colors"
                        title="Copy address"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-sm text-[#f94144] hover:bg-[#d0c3b1]/30 transition-colors font-['Montserrat'] flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Disconnect Wallet
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button 
              onClick={connectWallet}
              className="bg-[#f0b90b] hover:bg-[#d9a70a] text-white px-5 py-2 rounded-lg transition-all duration-300 font-medium"
            >
              Connect Wallet
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
