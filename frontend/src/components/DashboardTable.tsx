import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../lib/api';
import { ChevronDown, ChevronUp, ExternalLink, Clock, Tag } from 'lucide-react';
import type { CategoryStats } from '../types';

export function DashboardTable() {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      console.log('Processed dashboard stats:', data);
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        <p>Error loading dashboard data: {error}</p>
        <button 
          onClick={loadDashboardStats}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stats.length) {
    return (
      <div className="text-center py-8 text-gray-600">
        No data available
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Base Keywords
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Learned Keywords
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              URLs Found
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Updated
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stats.map((category) => (
            <React.Fragment key={category.name}>
              <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleCategory(category.name)}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {expandedCategory === category.name ? 
                      <ChevronUp className="h-5 w-5 text-gray-400 mr-2" /> : 
                      <ChevronDown className="h-5 w-5 text-gray-400 mr-2" />
                    }
                    <div>
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{category.baseKeywords?.length || 0}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{category.learnedKeywordsList?.length || 0}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{category.urls?.length || 0}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {new Date(category.lastUpdated).toLocaleDateString()}
                  </div>
                </td>
              </tr>
              
              {expandedCategory === category.name && (
                <tr>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Base Keywords Section */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Base Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.baseKeywords?.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Learned Keywords Section */}
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Learned Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.learnedKeywordsList?.map((keyword, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* URLs Section */}
                      {category.urls && category.urls.length > 0 && (
                        <div className="md:col-span-2">
                          <h4 className="font-medium text-gray-900 mb-3">URLs Found</h4>
                          <div className="space-y-2">
                            {category.urls.map((url, idx) => (
                              <a
                                key={idx}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                {url}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
} 