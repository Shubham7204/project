import React, { useState, useEffect } from 'react';
import { getDashboardStats } from '../lib/api';
import { ChevronDown, ChevronUp, ExternalLink, Clock } from 'lucide-react';
import type { CategoryStats } from '../types/dashboard';

export function DashboardTable() {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
              <tr 
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => toggleCategory(category.name)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {expandedCategory === category.name ? 
                      <ChevronUp className="h-4 w-4 mr-2 text-gray-400" /> : 
                      <ChevronDown className="h-4 w-4 mr-2 text-gray-400" />
                    }
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.baseKeywords?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.learnedKeywordsList?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {category.urls?.length || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(category.lastUpdated).toLocaleDateString()}
                  </div>
                </td>
              </tr>
              {expandedCategory === category.name && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 bg-gray-50">
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Base Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.baseKeywords?.map((keyword, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Base URLs</h4>
                        <div className="space-y-2">
                          {category.baseUrls?.map((url, idx) => (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center text-sm text-green-600 hover:text-green-800 hover:underline"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              {url}
                            </a>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Learned Keywords</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.learnedKeywordsList?.map((keyword, idx) => (
                            <span 
                              key={idx}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                            >
                              {keyword}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {category.urls && category.urls.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Found URLs</h4>
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

                      {category.learnedUrls && category.learnedUrls.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Learned URLs</h4>
                          <div className="space-y-2">
                            {category.learnedUrls.map((url, idx) => (
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