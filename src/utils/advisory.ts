import type { Advisory, WeatherData } from '../types';

/**
 * Turns the live forecast into ranked, plain-language farm advice.
 * The advice on screen always matches the weather on screen.
 */
export function buildAdvisories(weather: WeatherData): Advisory[] {
  const advisories: Advisory[] = [];
  const today = weather.forecast[0];
  const tomorrow = weather.forecast[1];
  const rainSoon = weather.hoursUntilRain !== null && weather.hoursUntilRain <= 24;
  const heavyRain = (today?.rainMm ?? 0) >= 10 || (weather.rainMmToday ?? 0) >= 10;

  if (rainSoon) {
    advisories.push({
      id: 'delay-spray',
      severity: 'urgent',
      titleKey: 'adv.delaySpray.title',
      reasonKey: 'adv.delaySpray.reason',
      params: { hours: weather.hoursUntilRain as number }
    });
  }

  if (heavyRain) {
    advisories.push({
      id: 'cover-harvest',
      severity: 'urgent',
      titleKey: 'adv.coverHarvest.title',
      reasonKey: 'adv.coverHarvest.reason'
    });
  }

  const expectedRainMm = Math.max(weather.rainMmToday ?? 0, today?.rainMm ?? 0);
  if (expectedRainMm >= 3) {
    advisories.push({
      id: 'skip-irrigation',
      severity: 'caution',
      titleKey: 'adv.skipIrrigation.title',
      reasonKey: 'adv.skipIrrigation.reason',
      params: { mm: Math.round(expectedRainMm) }
    });
  }

  if (weather.windKph >= 20) {
    advisories.push({
      id: 'windy',
      severity: 'caution',
      titleKey: 'adv.windy.title',
      reasonKey: 'adv.windy.reason',
      params: { wind: Math.round(weather.windKph) }
    });
  }

  if ((today?.maxTempC ?? weather.tempC) >= 36) {
    advisories.push({
      id: 'heat',
      severity: 'caution',
      titleKey: 'adv.heat.title',
      reasonKey: 'adv.heat.reason',
      params: { temp: Math.round(today?.maxTempC ?? weather.tempC) }
    });
  }

  const dryWeek = weather.forecast.every((day) => day.rainChance < 25);
  if (dryWeek) {
    advisories.push({
      id: 'irrigate',
      severity: 'caution',
      titleKey: 'adv.irrigate.title',
      reasonKey: 'adv.irrigate.reason'
    });
  }

  const calmAndDry =
  !rainSoon &&
  weather.windKph < 15 &&
  (today?.rainChance ?? 0) < 25 &&
  (tomorrow?.rainChance ?? 0) < 25;
  if (calmAndDry) {
    advisories.push({
      id: 'good-spray',
      severity: 'good',
      titleKey: 'adv.goodSpray.title',
      reasonKey: 'adv.goodSpray.reason'
    });
  }

  if (advisories.length === 0) {
    advisories.push({
      id: 'clear',
      severity: 'good',
      titleKey: 'adv.clear.title',
      reasonKey: 'adv.clear.reason'
    });
  }

  const rank: Record<Advisory['severity'], number> = { urgent: 0, caution: 1, good: 2 };
  return advisories.sort((a, b) => rank[a.severity] - rank[b.severity]).slice(0, 3);
}