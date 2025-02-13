import { useState, useEffect } from 'react';
import { signOut } from '../lib/api';
import toast from 'react-hot-toast';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Error signing out');
    }
  };

  return {
    isAuthenticated,
    setIsAuthenticated,
    handleSignOut
  };
} 