'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ethers } from 'ethers';
import { showError } from '@/utils/toast';

interface User {
  id: string;
  address: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to check session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);

  // Connect wallet without requiring signature
  const connectWallet = async () => {
    if (!window.ethereum) {
      showError('MetaMask is not installed. Please install MetaMask to use this feature.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      
      console.log('Connected to wallet with address:', address);
      
      // Authenticate with the server using just the address
      const requestBody = { address };
      console.log('Sending auth request with body:', requestBody);
      
      const authResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      console.log('Auth response status:', authResponse.status);
      const data = await authResponse.json();
      console.log('Auth response data:', data);
      
      if (data.success) {
        setUser(data.user);
        console.log('User authenticated:', data.user);
      } else {
        console.error('Authentication failed:', data.error);
        throw new Error(data.error || 'Authentication failed');
      }
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      // Check if the error is due to user cancelling the login
      if (error.code === 4001 || error.message?.includes('User denied') || error.message?.includes('user rejected')) {
        showError('User rejected the request.');
      } else {
        showError('Failed to connect wallet. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    try {
      setIsLoading(true);
      
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      
      setUser(null);
    } catch (error) {
      console.error('Failed to logout:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, connectWallet, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Add TypeScript declaration for window.ethereum
declare global {
  interface Window {
    ethereum: any;
  }
}
