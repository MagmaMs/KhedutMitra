import { fetchApi } from './client';
import type { AgriProduct, GovernmentScheme, DiseaseResult, CropAdviceResponse } from '../types';

export const productsApi = {
  getProducts: (category?: string) => 
    fetchApi<AgriProduct[]>(`/products${category && category !== 'all' ? `?category=${category}` : ''}`),
};

export const schemesApi = {
  getSchemes: (category?: string) => 
    fetchApi<GovernmentScheme[]>(`/schemes${category && category !== 'all' ? `?category=${category}` : ''}`),
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
