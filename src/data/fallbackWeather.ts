import type { ForecastDay, WeatherData } from '../types';
import { toISODateOnly } from '../utils/format';

/** Used when Open-Meteo is unreachable, so the dashboard never shows a blank weather card. */
export function buildFallbackWeather(): WeatherData {
  const today = new Date();
  const pattern: Array<Omit<ForecastDay, 'date'>> = [
  { maxTempC: 33, minTempC: 24, rainChance: 70, rainMm: 6.4, code: 80 },
  { maxTempC: 31, minTempC: 23, rainChance: 55, rainMm: 3.1, code: 61 },
  { maxTempC: 32, minTempC: 24, rainChance: 20, rainMm: 0.4, code: 3 },
  { maxTempC: 34, minTempC: 25, rainChance: 10, rainMm: 0, code: 2 },
  { maxTempC: 35, minTempC: 26, rainChance: 5, rainMm: 0, code: 1 }];


  const forecast: ForecastDay[] = pattern.map((day, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() + index);
    return { ...day, date: toISODateOnly(date) };
  });

  return {
    tempC: 31,
    feelsLikeC: 34,
    humidity: 68,
    windKph: 12,
    code: 3,
    rainChanceToday: 70,
    rainMmToday: 6.4,
    hoursUntilRain: 18,
    forecast,
    observedAt: new Date().toISOString()
  };
}