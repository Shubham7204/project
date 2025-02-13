import { useState, useCallback, useEffect } from 'react';
import { analyzeContent } from '../lib/gemini';
import { saveSession, getCategories } from '../lib/api';
import toast from 'react-hot-toast';
import type { AnalysisReport } from '../types';

export function useAnalysis(onSessionUpdate: () => void) {
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentContent, setCurrentContent] = useState<string>('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadCategories();
    }
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (error: any) {
      console.error('Failed to load categories:', error);
      if (error.message === 'AUTH_REQUIRED') {
        window.location.href = '/login';
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnalysis = useCallback(async (acceptedFiles: File[]) => {
    if (!categories.length) {
      toast.error('Categories not loaded. Please try again.');
      return;
    }

    try {
      setIsAnalyzing(true);
      const file = acceptedFiles[0];
      const text = await file.text();
      setCurrentContent(text);
      
      const analysisResult = await analyzeContent(text, categories);
      if (!analysisResult) {
        throw new Error('Analysis failed - no result returned');
      }
      
      const formattedReport: AnalysisReport = {
        categories: Array.isArray(analysisResult.categories) ? analysisResult.categories : [],
        keywords: Array.isArray(analysisResult.keywords) ? analysisResult.keywords : [],
        urls: Array.isArray(analysisResult.urls) ? analysisResult.urls : [],
        learningProgress: analysisResult.learningProgress || {
          newKeywords: 0,
          categoriesUpdated: 0
        }
      };

      setReport(formattedReport);

      await saveSession(text, formattedReport);
      onSessionUpdate();
      
      toast.success('Analysis complete!');
    } catch (error: any) {
      console.error('Analysis failed:', error);
      if (error.message === 'AUTH_REQUIRED') {
        localStorage.removeItem('token');
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        toast.error(error.message || 'Failed to analyze content');
      }
    } finally {
      setIsAnalyzing(false);
    }
  }, [categories, onSessionUpdate]);

  return {
    report,
    isAnalyzing,
    currentContent,
    handleAnalysis,
    setReport,
    setCurrentContent,
    categories,
    isLoading
  };
} 