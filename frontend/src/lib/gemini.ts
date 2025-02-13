import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ContentCategory, AnalysisReport } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.match(urlRegex) || [];
}

export async function analyzeContent(text: string, categories: ContentCategory[]): Promise<AnalysisReport> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    const urls = extractUrls(text);

    const prompt = `Analyze this content and categorize keywords and URLs:

    Content: "${text}"

    Available Categories:
    ${categories.map(cat => `
    - ${cat.name}:
      Description: ${cat.description}
      Base Keywords: ${cat.baseKeywords.join(', ')}
      Base URLs: ${cat.baseUrls.join(', ')}
    `).join('\n')}

    Task:
    1. Extract and categorize new keywords that aren't in the base keywords
    2. Analyze and categorize URLs based on their content and relevance
    3. Provide confidence scores for each categorization

    Return a JSON object with:
    {
      "categories": [
        {
          "category": "categoryName",
          "score": number,
          "percentage": number,
          "matchedBaseKeywords": ["keyword1"],
          "newKeywords": [
            {
              "keyword": "string",
              "confidence": number,
              "relevance": "explanation of why this keyword belongs here"
            }
          ],
          "matchedBaseUrls": ["url1"],
          "newUrls": [
            {
              "url": "string",
              "confidence": number,
              "relevance": "explanation of why this URL belongs here"
            }
          ]
        }
      ],
      "uncategorizedKeywords": ["keyword1"],
      "uncategorizedUrls": ["url1"],
      "concerns": ["concern1"],
      "recommendations": ["rec1"]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    const cleanedResponse = responseText.replace(/```json\n?|\n?```/g, '').trim();
    
    if (!cleanedResponse) {
      throw new Error('Empty response from Gemini API');
    }

    try {
      const parsedResponse = JSON.parse(cleanedResponse);
      
      return {
        categories: parsedResponse.categories.map(cat => ({
          ...cat,
          matchedKeywords: [...cat.matchedBaseKeywords, ...cat.newKeywords.map(k => k.keyword)],
          urls: [...cat.matchedBaseUrls, ...cat.newUrls.map(u => u.url)]
        })),
        keywords: [...new Set([
          ...parsedResponse.categories.flatMap(c => c.newKeywords.map(k => k.keyword)),
          ...parsedResponse.uncategorizedKeywords
        ])],
        urls: parsedResponse.categories.flatMap(c => 
          c.newUrls.map(u => ({
            url: u.url,
            category: c.category,
            confidence: u.confidence,
            relevance: u.relevance
          }))
        ),
        concerns: parsedResponse.concerns || [],
        recommendations: parsedResponse.recommendations || [],
        learningProgress: {
          newKeywords: parsedResponse.categories.reduce((acc, cat) => 
            acc + cat.newKeywords.length, 0
          ),
          categoriesUpdated: parsedResponse.categories.length
        }
      };
    } catch (parseError) {
      console.error('Parse error:', parseError, 'Response:', cleanedResponse);
      throw new Error('Failed to parse analysis results');
    }
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

async function updateCategoryKeywords(categoryName: string, keywords: string[]) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${categoryName}/keywords`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ keywords }),
    });

    if (!response.ok) {
      throw new Error('Failed to update category keywords');
    }
  } catch (error) {
    console.error('Error updating keywords:', error);
  }
}