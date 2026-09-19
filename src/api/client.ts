import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const DEFAULT_TIMEOUT = 15000; // 15 seconds

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function getHeaders(isFormData: boolean): Promise<Headers> {
  const headers = new Headers();
  
  if (!isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  
  if (supabase) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers.set('Authorization', `Bearer ${session.access_token}`);
    }
  }
  return headers;
}

export async function fetchApi<T>(
  endpoint: string, 
  options: RequestInit & { timeout?: number; signal?: AbortSignal } = {}
): Promise<T> {
  const { timeout = DEFAULT_TIMEOUT, signal, ...fetchOptions } = options;
  const isFormData = fetchOptions.body instanceof FormData;
  const baseHeaders = await getHeaders(isFormData);
  
  // Merge custom headers
  if (fetchOptions.headers) {
    new Headers(fetchOptions.headers).forEach((value, key) => {
      baseHeaders.set(key, value);
    });
  }

  // Create abort controller with timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Handle external signal
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers: baseHeaders,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message = response.statusText;
      try {
        const errorData = await response.json();
        message = errorData.error || message;
      } catch { /* ignore */ }
      throw new ApiError(message, response.status);
    }

    return response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}
