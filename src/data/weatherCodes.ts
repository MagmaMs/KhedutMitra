import {
  CloudDrizzleIcon,
  CloudFogIcon,
  CloudLightningIcon,
  CloudRainIcon,
  CloudSunIcon,
  CloudIcon,
  SunIcon,
  type LucideIcon } from
'lucide-react';
import type { Localized } from '../types';

interface WeatherDescription {
  label: Localized;
  Icon: LucideIcon;
}

const clear: WeatherDescription = {
  label: { en: 'Clear sky', hi: 'साफ़ आसमान', gu: 'સ્વચ્છ આકાશ' },
  Icon: SunIcon
};
const partly: WeatherDescription = {
  label: { en: 'Partly cloudy', hi: 'आंशिक बादल', gu: 'આંશિક વાદળછાયું' },
  Icon: CloudSunIcon
};
const cloudy: WeatherDescription = {
  label: { en: 'Cloudy', hi: 'बादल', gu: 'વાદળછાયું' },
  Icon: CloudIcon
};
const fog: WeatherDescription = {
  label: { en: 'Fog', hi: 'कोहरा', gu: 'ધુમ્મસ' },
  Icon: CloudFogIcon
};
const drizzle: WeatherDescription = {
  label: { en: 'Light drizzle', hi: 'हल्की बूँदाबाँदी', gu: 'હળવો ઝરમર' },
  Icon: CloudDrizzleIcon
};
const rain: WeatherDescription = {
  label: { en: 'Rain', hi: 'बारिश', gu: 'વરસાદ' },
  Icon: CloudRainIcon
};
const showers: WeatherDescription = {
  label: { en: 'Rain showers', hi: 'तेज़ बौछारें', gu: 'વરસાદી ઝાપટાં' },
  Icon: CloudRainIcon
};
const storm: WeatherDescription = {
  label: { en: 'Thunderstorm', hi: 'आँधी-तूफ़ान', gu: 'ગાજવીજ સાથે વરસાદ' },
  Icon: CloudLightningIcon
};

export function describeWeather(code: number): WeatherDescription {
  if (code === 0) return clear;
  if (code === 1 || code === 2) return partly;
  if (code === 3) return cloudy;
  if (code === 45 || code === 48) return fog;
  if (code >= 51 && code <= 57) return drizzle;
  if (code >= 61 && code <= 67) return rain;
  if (code >= 80 && code <= 82) return showers;
  if (code >= 95) return storm;
  return cloudy;
}