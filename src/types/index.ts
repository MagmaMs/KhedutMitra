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
  previousModalPrice: number | null;
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
  farmerId: string;
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

/* ── Farm Profile ──────────────────────────────────────────── */

export interface FarmProfile {
  soilType: string;
  currentCrop: string;
  budget: string;
  previousCrop?: string;
  irrigationAvailable?: boolean;
  completed: boolean;
  updatedAt: string;
}

/* ── Community ─────────────────────────────────────────────── */

export interface CommunityPost {
  id: string;
  authorId: string;
  authorName: string;
  authorLocation?: string;
  isExpert?: boolean;
  title: string;
  body: string;
  crop?: string;
  category?: string;
  answerCount: number;
  createdAt: string;
}

export interface CommunityAnswer {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorLocation?: string;
  isExpert?: boolean;
  body: string;
  isAccepted?: boolean;
  createdAt: string;
}

/* ── Government Schemes ────────────────────────────────────── */

export interface GovernmentScheme {
  id: string;
  title: Localized;
  description: Localized;
  category: string;
  officialUrl: string;
  verifiedAt?: string;
}

/* ── Agri Products ─────────────────────────────────────────── */

export type ProductCategory =
  | 'seeds'
  | 'fertilizers'
  | 'pesticides'
  | 'insecticides'
  | 'tools'
  | 'machinery'
  | 'irrigation'
  | 'other';

export interface AgriProduct {
  id: string;
  name: string;
  category: ProductCategory;
  description?: string;
  brand?: string;
  vendor?: string;
  price: number;
  unit: string;
  rating?: number;
  ratingCount?: number;
  availability: boolean;
  location?: string;
  sourceType: 'demo' | 'live';
  updatedAt: string;
}

/* ── Disease Tracker ───────────────────────────────────────── */

export interface DiseaseResult {
  diagnosis: string;
  confidence?: number;
  severity?: 'low' | 'medium' | 'high' | 'unknown';
  explanation: string;
  recommendations: string[];
  prevention: string[];
  crop?: string;
  class_id?: number;
  disease_name?: string;
  confidence_pct?: number;
  top_predictions?: Array<{ class_id: number; disease: string; confidence: number }>;
}

/* ── Crop Advice ───────────────────────────────────────────── */

export interface AdviceTopic {
  id: string;
  titleKey: string;
  icon: string;
}

export interface CropAdviceResponse {
  recommendation: string;
  reasoning: string;
  actions: string[];
  cautions: string[];
  sources?: string[];
}