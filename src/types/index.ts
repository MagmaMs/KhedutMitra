export type Language = 'en' | 'hi' | 'gu';

export type Localized = Record<Language, string>;

export type Role = 'farmer' | 'buyer';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: Role;
  state: string;
  district: string;
}

export interface Crop {
  id: string;
  name: Localized;
  /** States (by id) where this commodity is actively traded in our mock mandi data. */
  states: string[];
  /** Reference modal price in rupees per quintal, used to seed mock mandi data. */
  basePricePerQuintal: number;
}

export interface District {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export interface StateRegion {
  id: string;
  name: string;
  districts: District[];
}

export interface Market {
  id: string;
  name: string;
  districtId: string;
  stateId: string;
  lat: number;
  lon: number;
}

export interface MarketPrice {
  marketId: string;
  marketName: string;
  districtName: string;
  distanceKm: number;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  previousModalPrice: number;
  arrivalDate: string;
}

export interface PricePoint {
  date: string;
  modalPrice: number;
}

export type ListingStatus = 'active' | 'sold' | 'withdrawn';

export interface Listing {
  id: string;
  cropId: string;
  quantityKg: number;
  pricePerKg: number;
  status: ListingStatus;
  createdAt: string;
  farmerName: string;
  farmerPhone: string;
  village: string;
  district: string;
  state: string;
  ownedByUser: boolean;
}

export interface ForecastDay {
  date: string;
  maxTempC: number;
  minTempC: number;
  rainChance: number;
  rainMm: number;
  code: number;
}

export interface WeatherData {
  tempC: number;
  feelsLikeC: number;
  humidity: number;
  windKph: number;
  code: number;
  rainChanceToday: number;
  rainMmToday: number;
  /** Hours until the next hour with a meaningful chance of rain, null when none in range. */
  hoursUntilRain: number | null;
  forecast: ForecastDay[];
  observedAt: string;
}

export type DataStatus = 'loading' | 'ready' | 'fallback' | 'error' | 'empty';

export type AdvisorySeverity = 'urgent' | 'caution' | 'good';

export interface Advisory {
  id: string;
  severity: AdvisorySeverity;
  titleKey: string;
  reasonKey: string;
  params?: Record<string, string | number>;
}