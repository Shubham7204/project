export interface ContentCategory {
  _id: string;
  name: string;
  description: string;
  baseKeywords: string[];
  baseUrls: string[];
  learningData: {
    keyword: string;
    frequency: number;
    confidence: number;
    lastUsed: string;
    context: {
      text: string;
      urls: string[];
    };
  }[];
  metadata: {
    totalDocuments: number;
    lastUpdated: string;
    averageConfidence: number;
  };
}

export interface UrlAnalysis {
  url: string;
  title: string;
  keywords: string[];
  summary: string;
}

export interface CategoryMatch {
  category: string;
  score: number;
  percentage: number;
  matchedKeywords: string[];
}

export interface AnalysisReport {
  categories: CategoryMatch[];
  keywords: string[];
  urls: UrlAnalysis[];
  concerns: string[];
  recommendations: string[];
  learningProgress: {
    newKeywords: number;
    categoriesUpdated: number;
  };
}

export interface User {
  _id: string;
  email: string;
  createdAt: string;
}

export interface Session {
  _id: string;
  user: string;
  content: string;
  report: AnalysisReport;
  createdAt: string;
}

export interface CategoryStats {
  name: string;
  description: string;
  totalKeywords: number;
  learnedKeywords: number;
  lastUpdated: string;
  totalDocuments: number;
  averageConfidence: number;
  urls: string[];
  baseUrls: string[];
  learnedUrls: string[];
  baseKeywords: string[];
  learnedKeywordsList: string[];
}