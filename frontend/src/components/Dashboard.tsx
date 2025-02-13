import React, { useState, useEffect } from 'react';
import { BarChart, Brain, Clock, Database, TrendingUp } from 'lucide-react';
import { getDashboardStats, getCategoryLearningData } from '../lib/api';
import type { CategoryStats, CategoryLearningData } from '../types/dashboard';

export function Dashboard() {
  const [stats, setStats] = useState<CategoryStats[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [learningData, setLearningData] = useState<CategoryLearningData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadCategoryData(selectedCategory);
    }
  }, [selectedCategory]);

  const loadDashboardStats = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    }
  };

  const loadCategoryData = async (categoryId: string) => {
    try {
      const data = await getCategoryLearningData(categoryId);
      setLearningData(data);
    } catch (error) {
      console.error('Failed to load category data:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Total Categories</h3>
            <Database className="h-6 w-6 text-blue-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold">{stats.length}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Total Documents</h3>
            <BarChart className="h-6 w-6 text-green-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold">
            {stats.reduce((sum, cat) => sum + cat.totalDocuments, 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Learned Keywords</h3>
            <Brain className="h-6 w-6 text-purple-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold">
            {stats.reduce((sum, cat) => sum + cat.learnedKeywords, 0)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Avg. Confidence</h3>
            <TrendingUp className="h-6 w-6 text-orange-500" />
          </div>
          <p className="mt-2 text-3xl font-semibold">
            {Math.round(stats.reduce((sum, cat) => sum + cat.averageConfidence, 0) / stats.length * 100)}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {stats.map((category) => (
          <div key={category.name} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated {new Date(category.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-gray-500">Keywords</p>
                <p className="text-xl font-semibold">{category.totalKeywords}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Documents</p>
                <p className="text-xl font-semibold">{category.totalDocuments}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="text-xl font-semibold">{Math.round(category.averageConfidence * 100)}%</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Top Keywords</h4>
              <div className="space-y-2">
                {category.topKeywords.map((keyword) => (
                  <div key={keyword.keyword} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{keyword.keyword}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-500">
                        {keyword.frequency}x
                      </span>
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 rounded-full h-2"
                          style={{ width: `${keyword.confidence * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 