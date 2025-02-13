import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../lib/api';
import type { CategoryStats } from '../types/dashboard';
import { FiBook, FiLink, FiTrendingUp, FiCalendar, FiDatabase } from 'react-icons/fi';

const BRUTALIST_COLORS = [
  'bg-yellow-400',
  'bg-pink-400',
  'bg-blue-400',
  'bg-green-400',
  'bg-purple-400'
];

export function DashboardTable() {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const loadDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
      if (data.length > 0) setSelectedCategory(data[0].name);
      setError(null);
    } catch (err) {
      setError('Failed to load dashboard stats');
      console.error('Failed to load dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStats();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-lg h-16 w-16 border-8 border-black border-t-yellow-400"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-black p-6 bg-red-300 rounded-lg border-4 border-black shadow-brutal">
      {error}
    </div>
  );

  const selectedCategoryData = stats.find(cat => cat.name === selectedCategory);

  return (
    <div className="bg-white rounded-lg border-4 border-black shadow-brutal">
      {/* Category Navigation */}
      <div className="border-b-4 border-black bg-gray-100">
        <nav className="flex overflow-x-auto py-6 px-8">
          {stats.map((category, idx) => (
            <button
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`
                whitespace-nowrap px-6 py-3 rounded-lg mr-4 text-base font-bold 
                transition-transform hover:-translate-y-1 hover:shadow-brutal-sm
                border-4 border-black transform 
                ${selectedCategory === category.name 
                  ? `${BRUTALIST_COLORS[idx % BRUTALIST_COLORS.length]} shadow-brutal-sm -translate-y-1` 
                  : 'bg-white hover:bg-gray-50'}`}
            >
              {category.name}
            </button>
          ))}
        </nav>
      </div>

      {selectedCategoryData && (
        <div className="p-8">
          {/* Category Header */}
          <div className="mb-8 p-6 bg-yellow-300 rounded-lg border-4 border-black shadow-brutal">
            <h2 className="text-3xl font-black text-black">{selectedCategoryData.name}</h2>
            <p className="text-black mt-2 font-medium">{selectedCategoryData.description}</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<FiBook className="w-6 h-6" />}
              title="Total Keywords"
              value={selectedCategoryData.totalKeywords}
              subtitle={`${selectedCategoryData.learnedKeywords} learned`}
              color="bg-pink-300"
            />
            <StatCard
              icon={<FiLink className="w-6 h-6" />}
              title="Total URLs"
              value={selectedCategoryData.urls.length}
              subtitle={`${selectedCategoryData.learnedUrls.length} learned`}
              color="bg-blue-300"
            />
            <StatCard
              icon={<FiTrendingUp className="w-6 h-6" />}
              title="Confidence"
              value={`${Math.round(selectedCategoryData.averageConfidence * 100)}%`}
              subtitle="Average score"
              color="bg-green-300"
            />
            <StatCard
              icon={<FiDatabase className="w-6 h-6" />}
              title="Documents"
              value={selectedCategoryData.totalDocuments}
              subtitle={`Last updated ${new Date(selectedCategoryData.lastUpdated).toLocaleDateString()}`}
              color="bg-purple-300"
            />
          </div>

          {/* Keywords and URLs Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keywords Section */}
            <div className="bg-blue-200 rounded-lg border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black text-black mb-4">Keywords</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-black mb-3">Base Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryData.baseKeywords.map(keyword => (
                      <span key={keyword} 
                        className="px-4 py-2 bg-white text-black rounded-lg border-2 border-black 
                          text-sm font-bold shadow-brutal-sm hover:-translate-y-1 transition-transform">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black mb-3">Learned Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategoryData.learnedKeywordsList.map(keyword => (
                      <span key={keyword} 
                        className="px-4 py-2 bg-green-300 text-black rounded-lg border-2 border-black 
                          text-sm font-bold shadow-brutal-sm hover:-translate-y-1 transition-transform">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* URLs Section */}
            <div className="bg-pink-200 rounded-lg border-4 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black text-black mb-4">URLs</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-bold text-black mb-3">Base URLs</h4>
                  <div className="space-y-2">
                    {selectedCategoryData.baseUrls.map(url => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 bg-white text-black rounded-lg border-2 border-black 
                          text-sm font-bold shadow-brutal-sm hover:-translate-y-1 transition-transform"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-black mb-3">Learned URLs</h4>
                  <div className="space-y-2">
                    {selectedCategoryData.learnedUrls.map(url => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-4 py-2 bg-green-300 text-black rounded-lg border-2 border-black 
                          text-sm font-bold shadow-brutal-sm hover:-translate-y-1 transition-transform"
                      >
                        {url}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  color: string;
}

function StatCard({ icon, title, value, subtitle, color }: StatCardProps) {
  return (
    <div className={`${color} p-6 rounded-lg border-4 border-black shadow-brutal hover:-translate-y-1 transition-transform`}>
      <div className="flex items-center space-x-3 text-black mb-2">
        {icon}
        <h3 className="text-sm font-bold">{title}</h3>
      </div>
      <div className="mt-2">
        <div className="text-3xl font-black text-black">{value}</div>
        <div className="text-sm font-bold text-black/70">{subtitle}</div>
      </div>
    </div>
  );
} 