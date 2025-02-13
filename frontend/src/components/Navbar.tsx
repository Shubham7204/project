import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Upload, LayoutDashboard, History } from 'lucide-react';

export function Navbar() {
  const { isAuthenticated, handleSignOut } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b-4 border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-black">ContentAI</Link>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={`font-medium ${isActive('/dashboard') ? 'text-black' : 'text-gray-600'}`}>
                  <LayoutDashboard className="w-6 h-6" />
                  Dashboard
                </Link>
                <Link to="/upload" className={`font-medium ${isActive('/upload') ? 'text-black' : 'text-gray-600'}`}>
                  <Upload className="w-6 h-6" />
                  Upload
                </Link>
                <button onClick={handleSignOut} className="font-medium text-gray-600">
                  <LogOut className="w-6 h-6" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link to="/login" className="font-medium text-gray-600">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 