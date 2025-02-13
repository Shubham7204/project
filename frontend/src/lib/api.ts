import type { ContentCategory, AnalysisReport, Session, CategoryStats } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function for API requests
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    throw new Error(error.message || 'API request failed');
  }

  return response.json();
}

// Auth endpoints
export async function signUp(email: string, password: string) {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
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
  const response = await fetch(`${API_URL}/api/auth/signin`, {
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
  await fetchWithAuth('/api/auth/signout', { method: 'POST' });
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
  return fetchWithAuth('/api/sessions');
}

// Category endpoints
export async function getCategories(): Promise<ContentCategory[]> {
  return fetchWithAuth('/api/categories');
}

// Dashboard endpoints
export async function getDashboardStats(): Promise<CategoryStats[]> {
  return fetchWithAuth('/api/dashboard');
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