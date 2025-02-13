import { SessionHistory } from '../components/SessionHistory';
import { useState, useEffect } from 'react';
import type { Session } from '../types';

export function History() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add your session loading logic here
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-lg h-16 w-16 border-8 border-black border-t-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-yellow-400 border-4 border-black rounded-lg p-8 shadow-brutal">
        <h1 className="text-4xl font-black text-black">Analysis History</h1>
        <p className="text-xl font-bold text-black mt-2">
          View your past content analysis sessions
        </p>
      </div>

      <div className="bg-white border-4 border-black rounded-lg shadow-brutal p-8">
        <SessionHistory sessions={sessions} />
      </div>
    </div>
  );
} 