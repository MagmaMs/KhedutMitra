import { useCallback, useEffect, useState } from 'react';
import { getMarketPrices } from '../data/markets';
import { useDemoState } from '../contexts/DemoContext';
import type { DataStatus, MarketPrice } from '../types';

interface UseMarketPricesResult {
  status: DataStatus;
  prices: MarketPrice[];
  refetch: () => void;
}

/**
 * Mandi prices come from bundled Agmarknet-shaped mock data. The short delay keeps
 * the loading state honest, and the presenter overrides force the other states.
 */
export function useMarketPrices(cropId: string, stateId: string, districtId: string): UseMarketPricesResult {
  const { priceState } = useDemoState();
  const [status, setStatus] = useState<DataStatus>('loading');
  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [token, setToken] = useState(0);

  const refetch = useCallback(() => setToken((value) => value + 1), []);

  useEffect(() => {
    if (priceState === 'loading') {
      setStatus('loading');
      setPrices([]);
      return;
    }
    if (priceState === 'error') {
      setStatus('error');
      setPrices([]);
      return;
    }
    if (priceState === 'empty') {
      setStatus('empty');
      setPrices([]);
      return;
    }

    setStatus('loading');
    const timer = window.setTimeout(() => {
      const result = getMarketPrices(cropId, stateId, districtId);
      setPrices(result);
      if (result.length === 0) setStatus('empty');else
      setStatus(priceState === 'cached' ? 'fallback' : 'ready');
    }, 450);

    return () => window.clearTimeout(timer);
  }, [cropId, stateId, districtId, priceState, token]);

  return { status, prices, refetch };
}