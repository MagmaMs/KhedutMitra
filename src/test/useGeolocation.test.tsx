import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGeolocation } from '../hooks/useGeolocation';

describe('useGeolocation', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it('initializes with null coords and no error', () => {
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.coords).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('loads coords from localStorage if available', () => {
    localStorage.setItem('km_coords', JSON.stringify({ lat: 22.0, lon: 71.0 }));
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.coords).toEqual({ lat: 22.0, lon: 71.0 });
  });

  it('sets error if geolocation is not supported', () => {
    // navigator.geolocation is undefined in jsdom by default
    const { result } = renderHook(() => useGeolocation());
    act(() => {
      result.current.requestLocation();
    });
    expect(result.current.error).toBe('Geolocation is not supported by your browser');
  });
});
