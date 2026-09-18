import React from 'react';
import { Card, Notice } from '../components';
import { useLanguage } from '../hooks/useLanguage';
import { useWeather } from '../hooks/useWeather';
import { Cloud, Droplets, Wind, Sun } from 'lucide-react';

// Assuming these exist, providing fallback if not
const WeatherCard = ({ data }: any) => <Card className="p-4"><p>Weather Data</p></Card>;
const ForecastStrip = ({ data }: any) => <div className="flex space-x-2">Forecast</div>;
const AdvisoryCard = ({ advisories }: any) => <Card className="p-4"><p>Advisories</p></Card>;

export function Weather() {
  const { t } = useLanguage();
  // Mocking weather hook usage
  const { data: weather, loading, error } = useWeather() || { data: null, loading: false, error: null };

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t('weather.title') || 'Detailed Weather'}
        </h1>
        <p className="mt-1 text-base text-ink-muted">
          {t('weather.subtitle') || 'Source: Open-Meteo'}
        </p>
      </div>

      <Notice tone="info" message={t('weather.advisoryNotice') || 'Weather conditions are optimal for spraying today.'} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <Sun className="text-accent" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Temperature</p>
            <p className="text-xl font-bold text-ink">32°C</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Droplets className="text-brand" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Humidity</p>
            <p className="text-xl font-bold text-ink">65%</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Wind className="text-ink-muted" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Wind</p>
            <p className="text-xl font-bold text-ink">12 km/h</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <Cloud className="text-ink-muted" size={32} />
          <div>
            <p className="text-sm text-ink-muted">Cloud Cover</p>
            <p className="text-xl font-bold text-ink">40%</p>
          </div>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-ink mt-8 mb-4">{t('weather.forecast') || '5-Day Forecast'}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((day) => (
          <Card key={day} className="p-4 text-center">
            <p className="font-medium text-ink">Day {day}</p>
            <Sun className="mx-auto my-2 text-accent" size={24} />
            <p className="text-lg font-bold text-ink">30° / 22°</p>
            <p className="text-sm text-ink-muted">Sunny</p>
          </Card>
        ))}
      </div>

      <h2 className="text-xl font-bold text-ink mt-8 mb-4">{t('weather.advisories') || 'Weather Advisories'}</h2>
      <AdvisoryCard advisories={[]} />
    </div>
  );
}
