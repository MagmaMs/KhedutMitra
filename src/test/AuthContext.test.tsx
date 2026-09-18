import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import React from 'react';

vi.mock('../lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    }
  },
  isSupabaseConfigured: true
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('provides loading state initially', () => {
    (supabase!.auth.getSession as any).mockResolvedValue(new Promise(() => {}));
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('restores session successfully', async () => {
    const mockUser = { id: '123', phone: '+919876543210' };
    (supabase!.auth.getSession as any).mockResolvedValue({ data: { session: { user: mockUser } } });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toEqual({
      id: '123',
      name: '',
      phone: '+919876543210',
      state: '',
      district: '',
      role: 'farmer'
    });
  });

  it('handles sign out', async () => {
    (supabase!.auth.signOut as any).mockResolvedValue({ error: null });
    (supabase!.auth.getSession as any).mockResolvedValue({ data: { session: null } });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.logout();
    });

    expect(supabase!.auth.signOut).toHaveBeenCalled();
    expect(result.current.user).toBeNull();
  });
});
