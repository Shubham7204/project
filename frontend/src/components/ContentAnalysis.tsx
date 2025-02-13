import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, AlertTriangle, Globe, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { AnalysisReport, UrlAnalysis } from '../types';

interface ContentAnalysisProps {
  onDrop: (acceptedFiles: File[]) => void;
  isAnalyzing: boolean;
  currentContent: string;
  report: AnalysisReport | null;
  expandedUrl: string | null;
  toggleUrlExpansion: (url: string) => void;
  isLoading: boolean;
}

export function ContentAnalysis({ 
  onDrop, 
  isAnalyzing, 
  currentContent, 
  report, 
  expandedUrl,
  toggleUrlExpansion,
  isLoading 
}: ContentAnalysisProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
  });

  const renderUrlAnalysis = (urlAnalysis: UrlAnalysis) => {
    const isExpanded = expandedUrl === urlAnalysis.url;
    return (
      <div key={urlAnalysis.url} className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleUrlExpansion(urlAnalysis.url)}>
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-blue-500 mr-2" />
            <div>
              <h4 className="font-medium">{urlAnalysis.title}</h4>
              <p className="text-sm text-gray-600">{urlAnalysis.url}</p>
            </div>
          </div>
          {isExpanded ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
        {isExpanded && (
          <div className="mt-4 space-y-4">
            <div>
              <h5 className="text-sm font-medium text-gray-700 mb-2">Found Keywords</h5>
              <div className="flex flex-wrap gap-2">
                {urlAnalysis.keywords.map((keyword, idx) => (
                  <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
            {urlAnalysis.summary && (
              <div>
                <h5 className="text-sm font-medium text-gray-700 mb-2">Summary</h5>
                <p className="text-sm text-gray-600">{urlAnalysis.summary}</p>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-8 text-center ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}>
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">
          {isDragActive ? 'Drop the file here...' : 'Drag and drop a text file, or click to select'}
        </p>
      </div>

      {isAnalyzing && (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3">Analyzing content...</span>
        </div>
      )}

      {currentContent && (
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown>{currentContent}</ReactMarkdown>
        </div>
      )}

      {report && (
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Results</h2>
          
          <div className="space-y-6">
            {/* Category Matches */}
            {report.categories && report.categories.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Matches</h3>
                <div className="space-y-3">
                  {report.categories.map((category, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 text-blue-500 mr-2" />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-500 rounded-full h-2" 
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.round(category.percentage)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {report.keywords && report.keywords.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Detected Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.keywords.map((keyword, idx) => (
                    <span 
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* URLs */}
            {report.urls && report.urls.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Found URLs
                </h3>
                <div className="space-y-4">
                  {report.urls.map(url => renderUrlAnalysis(url))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 