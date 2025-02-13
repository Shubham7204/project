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

    const prompt = `Analyze this content and provide a JSON response:

    Content: "${text}"

    ${urls.length > 0 ? `URLs: ${urls.join(', ')}` : ''}

    Available Categories:
    ${categories.map(cat => `- ${cat.name}: ${cat.description}`).join('\n')}

    Return a JSON object with:
    - Category matches with scores
    - Key concepts and keywords
    - URL analysis if any URLs are found
    - Any concerns or recommendations

    Format:
    {
      "categories": [
        {
          "category": "categoryName",
          "score": number,
          "percentage": number,
          "matchedKeywords": ["keyword1", "keyword2"]
        }
      ],
      "keywords": ["keyword1", "keyword2"],
      "urls": [
        {
          "url": "url",
          "title": "title",
          "keywords": ["keyword1", "keyword2"],
          "summary": "brief summary"
        }
      ],
      "concerns": ["concern1", "concern2"],
      "recommendations": ["rec1", "rec2"]
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
        categories: parsedResponse.categories || [],
        keywords: parsedResponse.keywords || [],
        urls: parsedResponse.urls || [],
        concerns: parsedResponse.concerns || [],
        recommendations: parsedResponse.recommendations || [],
        learningProgress: {
          newKeywords: 0,
          categoriesUpdated: 0
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