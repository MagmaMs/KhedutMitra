import { supabase } from '../lib/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

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

export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const baseHeaders = await getHeaders(isFormData);
  
  // Merge custom headers
  if (options.headers) {
    new Headers(options.headers).forEach((value, key) => {
      baseHeaders.set(key, value);
    });
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: baseHeaders,
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
}
