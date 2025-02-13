import React from 'react';
import { LogOut } from 'lucide-react';

interface LayoutProps {
  title: string;
  onSignOut?: () => void;
  children: React.ReactNode;
}

export function Layout({ title, onSignOut, children }: LayoutProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Sign Out
          </button>
        )}
      </div>
      {children}
    </div>
  );
} 