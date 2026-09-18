import { fetchApi } from './client';
import type { WeatherData } from '../types';

export const weatherApi = {
  getForecast: (lat: number, lon: number) => 
    fetchApi<WeatherData>(`/weather?lat=${lat}&lon=${lon}`),
};
