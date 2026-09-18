import type { Market, MarketPrice, PricePoint } from '../types';
import { findCrop } from './crops';
import { findDistrict, findState } from './locations';
import { distanceInKm } from '../utils/distance';
import { toISODateOnly } from '../utils/format';

export const markets: Market[] = [
// Gujarat
{ id: 'anand-apmc', name: 'Anand APMC', districtId: 'anand', stateId: 'gujarat', lat: 22.5645, lon: 72.9289 },
{ id: 'vadodara-apmc', name: 'Vadodara APMC', districtId: 'vadodara', stateId: 'gujarat', lat: 22.3072, lon: 73.1812 },
{ id: 'nadiad-yard', name: 'Nadiad Market Yard', districtId: 'anand', stateId: 'gujarat', lat: 22.6939, lon: 72.8618 },
{ id: 'rajkot-apmc', name: 'Rajkot APMC', districtId: 'rajkot', stateId: 'gujarat', lat: 22.3039, lon: 70.8022 },
{ id: 'surat-apmc', name: 'Surat APMC', districtId: 'surat', stateId: 'gujarat', lat: 21.1702, lon: 72.8311 },
{ id: 'mehsana-yard', name: 'Mehsana Market Yard', districtId: 'mehsana', stateId: 'gujarat', lat: 23.588, lon: 72.3693 },
{ id: 'junagadh-apmc', name: 'Junagadh APMC', districtId: 'junagadh', stateId: 'gujarat', lat: 21.5222, lon: 70.4579 },
{ id: 'unjha-yard', name: 'Unjha Market Yard', districtId: 'mehsana', stateId: 'gujarat', lat: 23.8, lon: 72.39 },

// Maharashtra
{ id: 'pune-apmc', name: 'Pune Market Yard', districtId: 'pune', stateId: 'maharashtra', lat: 18.5204, lon: 73.8567 },
{ id: 'nashik-apmc', name: 'Nashik APMC', districtId: 'nashik', stateId: 'maharashtra', lat: 19.9975, lon: 73.7898 },
{ id: 'lasalgaon', name: 'Lasalgaon Mandi', districtId: 'nashik', stateId: 'maharashtra', lat: 20.1436, lon: 74.2386 },
{ id: 'nagpur-apmc', name: 'Nagpur APMC', districtId: 'nagpur', stateId: 'maharashtra', lat: 21.1458, lon: 79.0882 },
{ id: 'jalgaon-apmc', name: 'Jalgaon APMC', districtId: 'jalgaon', stateId: 'maharashtra', lat: 21.0077, lon: 75.5626 },

// Madhya Pradesh
{ id: 'indore-mandi', name: 'Indore Chhawni Mandi', districtId: 'indore', stateId: 'madhya-pradesh', lat: 22.7196, lon: 75.8577 },
{ id: 'bhopal-mandi', name: 'Bhopal Karond Mandi', districtId: 'bhopal', stateId: 'madhya-pradesh', lat: 23.2599, lon: 77.4126 },
{ id: 'ujjain-mandi', name: 'Ujjain Krishi Upaj Mandi', districtId: 'ujjain', stateId: 'madhya-pradesh', lat: 23.1765, lon: 75.7885 },
{ id: 'dewas-mandi', name: 'Dewas Mandi', districtId: 'indore', stateId: 'madhya-pradesh', lat: 22.9676, lon: 76.0534 },

// Rajasthan
{ id: 'jaipur-mandi', name: 'Jaipur Muhana Mandi', districtId: 'jaipur', stateId: 'rajasthan', lat: 26.9124, lon: 75.7873 },
{ id: 'kota-mandi', name: 'Kota Bhamashah Mandi', districtId: 'kota', stateId: 'rajasthan', lat: 25.2138, lon: 75.8648 },
{ id: 'jodhpur-mandi', name: 'Jodhpur Mandi', districtId: 'jodhpur', stateId: 'rajasthan', lat: 26.2389, lon: 73.0243 },

// Punjab
{ id: 'ludhiana-mandi', name: 'Ludhiana Grain Market', districtId: 'ludhiana', stateId: 'punjab', lat: 30.901, lon: 75.8573 },
{ id: 'amritsar-mandi', name: 'Amritsar Grain Market', districtId: 'amritsar', stateId: 'punjab', lat: 31.634, lon: 74.8723 },
{ id: 'patiala-mandi', name: 'Patiala Mandi', districtId: 'patiala', stateId: 'punjab', lat: 30.3398, lon: 76.3869 },

// Uttar Pradesh
{ id: 'lucknow-mandi', name: 'Lucknow Sitapur Road Mandi', districtId: 'lucknow', stateId: 'uttar-pradesh', lat: 26.8467, lon: 80.9462 },
{ id: 'kanpur-mandi', name: 'Kanpur Chakarpur Mandi', districtId: 'kanpur', stateId: 'uttar-pradesh', lat: 26.4499, lon: 80.3319 },
{ id: 'varanasi-mandi', name: 'Varanasi Pahadia Mandi', districtId: 'varanasi', stateId: 'uttar-pradesh', lat: 25.3176, lon: 82.9739 }];


/** Small deterministic hash so mock prices are stable between renders and reloads. */
function seededUnit(seed: string): number {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) % 1000 / 1000;
}

function dayKey(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - offsetDays);
  return toISODateOnly(date);
}

function modalFor(cropId: string, marketId: string, base: number, offsetDays: number): number {
  const spread = seededUnit(`${cropId}:${marketId}`) - 0.5; // ±0.5
  const drift = seededUnit(`${cropId}:${marketId}:${dayKey(offsetDays)}`) - 0.5;
  const value = base * (1 + spread * 0.09 + drift * 0.035);
  return Math.round(value / 5) * 5;
}

export function getMarketPrices(cropId: string, stateId: string, districtId: string): MarketPrice[] {
  const crop = findCrop(cropId);
  const state = findState(stateId);
  const district = findDistrict(stateId, districtId);
  if (!crop || !state || !district) return [];
  if (!crop.states.includes(stateId)) return [];

  const arrivalDate = dayKey(0);

  return markets.
  filter((market) => market.stateId === stateId).
  map((market) => {
    const modalPrice = modalFor(cropId, market.id, crop.basePricePerQuintal, 0);
    const previousModalPrice = modalFor(cropId, market.id, crop.basePricePerQuintal, 1);
    const band = Math.round(modalPrice * (0.05 + seededUnit(`${market.id}:band`) * 0.05));
    const marketDistrict = findDistrict(stateId, market.districtId);
    return {
      marketId: market.id,
      marketName: market.name,
      districtName: marketDistrict?.name ?? '',
      distanceKm: distanceInKm(district, market),
      minPrice: Math.round((modalPrice - band) / 5) * 5,
      maxPrice: Math.round((modalPrice + band * 0.8) / 5) * 5,
      modalPrice,
      previousModalPrice,
      arrivalDate
    };
  }).
  sort((a, b) => b.modalPrice - a.modalPrice);
}

export function getPriceHistory(cropId: string, marketId: string): PricePoint[] {
  const crop = findCrop(cropId);
  if (!crop) return [];
  const points: PricePoint[] = [];
  for (let offset = 6; offset >= 0; offset -= 1) {
    points.push({
      date: dayKey(offset),
      modalPrice: modalFor(cropId, marketId, crop.basePricePerQuintal, offset)
    });
  }
  return points;
}