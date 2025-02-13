import type { ContentCategory, AnalysisReport, Session, CategoryStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

// Helper function for API requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('AUTH_REQUIRED');
  }

  const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('AUTH_REQUIRED');
    }
    throw new Error(`API Error: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

// Auth endpoints
export async function signUp(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  localStorage.setItem('token', data.token);
  return data;
}

export async function signIn(email: string, password: string) {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  localStorage.setItem('token', data.token);
  return data;
}

export async function signOut() {
  await fetchWithAuth('/auth/signout', { method: 'POST' });
  localStorage.removeItem('token');
}

// Session endpoints
export async function saveSession(content: string, report: AnalysisReport): Promise<Session> {
  return fetchWithAuth('/sessions', {
    method: 'POST',
    body: JSON.stringify({ content, report }),
  });
}

export async function getSessions(): Promise<Session[]> {
  return fetchWithAuth('/sessions');
}

// Category endpoints
export async function getCategories(): Promise<ContentCategory[]> {
  const response = await fetchWithAuth('/api/dashboard/categories');
  return response;
}

// Dashboard endpoints
export async function getDashboardStats(): Promise<CategoryStats[]> {
  try {
    const response = await fetchWithAuth('/api/dashboard');
    console.log('Raw API response:', response);
    if (!Array.isArray(response)) {
      throw new Error('Invalid response format');
    }
    return response;
  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw error;
  }
}

export async function getCategoryLearningData(categoryId: string): Promise<CategoryLearningData> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Not authenticated');
  }

  const response = await fetch(`${API_URL}/dashboard/category/${categoryId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch category learning data');
  }

  return response.json();
} 