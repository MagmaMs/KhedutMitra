import { fetchApi } from './client';
import type { MarketPrice, PricePoint } from '../types';

export const pricesApi = {
  getMarketPrices: (cropId: string, stateId: string, districtId: string) => 
    fetchApi<MarketPrice[]>(`/prices?crop=${cropId}&state=${stateId}&district=${districtId}`),
    
  getPriceHistory: (cropId: string, marketId: string) =>
    fetchApi<PricePoint[]>(`/prices/history?crop=${cropId}&market=${marketId}`),
};
