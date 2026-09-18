import React, { useMemo } from 'react';
import { Card, Notice, Button } from '../components';
import { useLanguage } from '../hooks/useLanguage';
import { useAuth } from '../hooks/useAuth';
import { useWeather } from '../hooks/useWeather';
import { useGeolocation } from '../hooks/useGeolocation';
import { Cloud, Droplets, Wind, Sun, RefreshCw } from 'lucide-react';
import { findDistrict } from '../data/locations';
import { buildAdvisories } from '../utils/advisory';

export function Weather() {
  const { t } = useLanguage();
  const { user } = useAuth();
  
  const district = useMemo(
    () => findDistrict(user?.state ?? '', user?.district ?? ''),
    [user?.state, user?.district]
  );
  
  const { coords, requestLocation, loading: locationLoading } = useGeolocation();
  const { status, weather, refetch } = useWeather(district, coords);
  
  const advisories = useMemo(() => weather ? buildAdvisories(weather) : [], [weather]);

  if (status === 'loading') {
    return <div className="p-4 text-center">{t('common.loading') || 'Loading...'}</div>;
  }

  if (status === 'error' || !weather) {
    return (
      <div className="p-4 text-center space-y-4">
        <p className="text-error">{t('weather.error') || 'Could not load weather'}</p>
        <Button onClick={refetch}><RefreshCw className="w-4 h-4 mr-2" /> Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
            {t('weather.title') || 'Detailed Weather'}
          </h1>
          <p className="mt-1 text-base text-ink-muted">
            {district?.name} • {t('weather.subtitle') || 'Source: Open-Meteo'}
          </p>
        </div>
        <Button variant="secondary" onClick={refetch}>
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {advisories.length > 0 && (
        <Notice tone="info" message={advisories[0].text} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <Sun className="text-accent" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Temperature</p>
            <p className="text-xl font-bold text-ink">{weather.tempC}°C</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Droplets className="text-brand" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Humidity</p>
            <p className="text-xl font-bold text-ink">{weather.humidity}%</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Wind className="text-ink-muted" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Wind</p>
            <p className="text-xl font-bold text-ink">{weather.windKph} km/h</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Cloud className="text-ink-muted" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Rain Chance</p>
            <p className="text-xl font-bold text-ink">{weather.rainChanceToday}%</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-ink mt-8 mb-4">{t('weather.forecast') || '5-Day Forecast'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {weather.forecast.slice(0, 5).map((day, idx) => (
          <Card key={idx} className="p-4 text-center">
            <p className="font-medium text-ink">{new Date(day.date).toLocaleDateString(undefined, { weekday: 'short' })}</p>
            <Sun className="mx-auto my-2 text-accent" size={24} />
            <p className="text-lg font-bold text-ink">{day.maxTempC}° / {day.minTempC}°</p>
            <p className="text-sm text-ink-muted">{day.rainChance}% rain</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
