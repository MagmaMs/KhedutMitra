import { fetchApi } from './client';
import type { AgriProduct, GovernmentScheme, CommunityPost, CommunityAnswer, DiseaseResult, CropAdviceResponse } from '../types';

export const productsApi = {
  getProducts: (category?: string) => 
    fetchApi<AgriProduct[]>(`/products${category && category !== 'all' ? `?category=${category}` : ''}`),
};

export const schemesApi = {
  getSchemes: (category?: string) => 
    fetchApi<GovernmentScheme[]>(`/schemes${category && category !== 'all' ? `?category=${category}` : ''}`),
};

export const communityApi = {
  getPosts: () => fetchApi<CommunityPost[]>('/community/posts'),
  getPost: (id: string) => fetchApi<CommunityPost>(`/community/posts/${id}`),
  getAnswers: (postId: string) => fetchApi<CommunityAnswer[]>(`/community/posts/${postId}/answers`),
  createPost: (post: Partial<CommunityPost>) => fetchApi<CommunityPost>('/community/posts', {
    method: 'POST',
    body: JSON.stringify(post),
  }),
  createAnswer: (postId: string, answer: Partial<CommunityAnswer>) => fetchApi<CommunityAnswer>(`/community/posts/${postId}/answers`, {
    method: 'POST',
    body: JSON.stringify(answer),
  }),
};

export const aiApi = {
  analyzeDisease: (formData: FormData) => fetchApi<DiseaseResult>('/ai/disease', {
    method: 'POST',
    body: formData,
  }),
  
  getAdvice: (query: string, context?: any) => fetchApi<CropAdviceResponse>('/ai/advice', {
    method: 'POST',
    body: JSON.stringify({ query, context }),
  }),
};
