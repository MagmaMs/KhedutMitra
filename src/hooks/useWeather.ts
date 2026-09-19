import { useCallback, useEffect, useState } from 'react';
import { buildFallbackWeather } from '../data/fallbackWeather';
import { useDemoState } from '../contexts/DemoContext';
import type { District, WeatherData } from '../types';

export type WeatherStatus = 'loading' | 'ready' | 'fallback' | 'error' | 'noLocation';

interface UseWeatherResult {
  status: WeatherStatus;
  weather: WeatherData | null;
  refetch: () => void;
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
  hourly: {
    time: string[];
    precipitation_probability: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    precipitation_sum: number[];
    weather_code: number[];
  };
}

function parseWeather(payload: OpenMeteoResponse): WeatherData {
  const hourlyTimes: string[] = payload.hourly?.time ?? [];
  const hourlyProb: number[] = payload.hourly?.precipitation_probability ?? [];
  const now = Date.now();
  let hoursUntilRain: number | null = null;
  for (let i = 0; i < hourlyTimes.length; i += 1) {
    const time = new Date(hourlyTimes[i]).getTime();
    if (time < now) continue;
    if ((hourlyProb[i] ?? 0) >= 50) {
      hoursUntilRain = Math.max(1, Math.round((time - now) / 3600000));
      break;
    }
  }

  const forecast = (payload.daily?.time ?? []).map((date: string, index: number) => ({
    date,
    maxTempC: Math.round(payload.daily.temperature_2m_max[index]),
    minTempC: Math.round(payload.daily.temperature_2m_min[index]),
    rainChance: Math.round(payload.daily.precipitation_probability_max?.[index] ?? 0),
    rainMm: Number(payload.daily.precipitation_sum?.[index] ?? 0),
    code: payload.daily.weather_code[index]
  }));

  return {
    tempC: Math.round(payload.current.temperature_2m),
    feelsLikeC: Math.round(payload.current.apparent_temperature),
    humidity: Math.round(payload.current.relative_humidity_2m),
    windKph: Math.round(payload.current.wind_speed_10m),
    code: payload.current.weather_code,
    rainChanceToday: forecast[0]?.rainChance ?? 0,
    rainMmToday: forecast[0]?.rainMm ?? 0,
    hoursUntilRain,
    forecast,
    observedAt: new Date().toISOString()
  };
}

export function useWeather(district: District | undefined, coords?: {lat: number, lon: number} | null): UseWeatherResult {
  const { weatherState } = useDemoState();
  const [status, setStatus] = useState<WeatherStatus>('loading');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [token, setToken] = useState(0);

  const refetch = useCallback(() => setToken((value) => value + 1), []);

  useEffect(() => {
    if (weatherState === 'loading') {
      setStatus('loading');
      setWeather(null);
      return;
    }
    if (weatherState === 'error') {
      setStatus('error');
      setWeather(null);
      return;
    }
    if (weatherState === 'noLocation') {
      setStatus('noLocation');
      setWeather(null);
      return;
    }
    if (weatherState === 'fallback') {
      setStatus('fallback');
      setWeather(buildFallbackWeather());
      return;
    }
    
    const targetLat = coords?.lat ?? district?.lat;
    const targetLon = coords?.lon ?? district?.lon;

    if (targetLat === undefined || targetLon === undefined) {
      setStatus('noLocation');
      setWeather(null);
      return;
    }

    let cancelled = false;
    setStatus('loading');

    import('../api/weather').then(({ weatherApi }) => {
      weatherApi.getForecast(targetLat, targetLon)
        .then((payload) => {
          if (cancelled) return;
          setWeather(parseWeather(payload));
          setStatus('ready');
        })
        .catch(() => {
          if (cancelled) return;
          setWeather(buildFallbackWeather());
          setStatus('fallback');
        });
    });

    return () => {
      cancelled = true;
    };
  }, [district, coords, weatherState, token]);

  return { status, weather, refetch };
}