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
  topKeywords?: {
    keyword: string;
    frequency: number;
    confidence: number;
  }[];
}

export interface CategoryLearningData {
  baseKeywords: string[];
  learnedKeywords: {
    keyword: string;
    frequency: number;
    confidence: number;
    lastUsed: string;
    contextCount: number;
  }[];
  metadata: {
    totalDocuments: number;
    lastUpdated: string;
    averageConfidence: number;
  };
} 