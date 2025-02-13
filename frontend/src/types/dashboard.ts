export interface CategoryStats {
  name: string;
  totalKeywords: number;
  learnedKeywords: number;
  lastUpdated: string;
  allKeywords: string[];
  urls: string[];
  baseUrls: string[];
  learnedUrls: string[];
  baseKeywords: string[];
  learnedKeywordsList: string[];
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