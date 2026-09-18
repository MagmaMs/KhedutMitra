import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ListingsProvider, useListings } from '../contexts/ListingsContext';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import React from 'react';

vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn()
  },
  isSupabaseConfigured: true
}));

vi.mock('../hooks/useAuth', () => ({
  useAuth: vi.fn()
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ListingsProvider>{children}</ListingsProvider>
);

describe('ListingsContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuth as any).mockReturnValue({
      user: {
        id: 'usr-1',
        name: 'Test Farmer',
        phone: '+919999999999',
        district: 'Test District',
        state: 'Gujarat'
      }
    });
  });

  it('fetches listings from supabase', async () => {
    const mockData = [{
      id: 'list-1',
      crop_id: 'wheat',
      quantity_kg: '1000',
      price_per_kg: '25',
      status: 'active',
      farmer_name: 'Test Farmer',
      farmer_phone: '+919999999999',
      village: 'Test Village',
      district: 'Test District',
      state: 'Gujarat',
      created_at: new Date().toISOString()
    }];

    const mockOrder = vi.fn().mockResolvedValue({ data: mockData, error: null });
    const mockSelect = vi.fn().mockReturnValue({ order: mockOrder });
    (supabase!.from as any).mockReturnValue({ select: mockSelect });

    const { result } = renderHook(() => useListings(), { wrapper });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.status).toBe('ready');
    expect(result.current.listings).toHaveLength(1);
    expect(result.current.listings[0].id).toBe('list-1');
    expect(result.current.listings[0].pricePerKg).toBe(25);
  });
});
