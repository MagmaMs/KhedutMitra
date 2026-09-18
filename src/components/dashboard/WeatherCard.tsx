import React from 'react';
import { DropletsIcon, MapPinIcon, ThermometerIcon, WindIcon } from 'lucide-react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ErrorState } from '../ErrorState';
import { Notice } from '../Notice';
import { Skeleton } from '../Skeleton';
import { describeWeather } from '../../data/weatherCodes';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatTime } from '../../utils/format';
import type { WeatherStatus } from '../../hooks/useWeather';
import type { WeatherData } from '../../types';

interface WeatherCardProps {
  status: WeatherStatus;
  weather: WeatherData | null;
  locationLabel: string;
  onRetry: () => void;
  onSetLocation: () => void;
}

export function WeatherCard({ status, weather, locationLabel, onRetry, onSetLocation }: WeatherCardProps) {
  const { t, tl } = useLanguage();

  if (status === 'loading') {
    return (
      <Card aria-busy="true" aria-label={t('common.loading')}>
        <Skeleton className="h-3.5 w-24" />
        <div className="mt-4 flex items-end justify-between gap-4">
          <div className="flex-1">
            <Skeleton className="h-11 w-32" />
            <Skeleton className="mt-3 h-3.5 w-40" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
          <Skeleton className="h-10" />
        </div>
      </Card>);

  }

  if (status === 'error' || !weather) {
    if (status === 'noLocation') {
      return (
        <Card>
          <h2 className="text-base font-bold text-ink">{t('weather.noLocationTitle')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t('weather.noLocationBody')}</p>
          <Button className="mt-4" onClick={onSetLocation}>
            <MapPinIcon className="h-4 w-4" aria-hidden="true" />
            {t('weather.setLocation')}
          </Button>
        </Card>);

    }
    return (
      <ErrorState
        title={t('weather.errorTitle')}
        body={t('weather.errorBody')}
        retryLabel={t('action.retry')}
        onRetry={onRetry} />);


  }

  const description = describeWeather(weather.code);
  const Icon = description.Icon;

  return (
    <Card>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{t('weather.title')}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-muted">
            <MapPinIcon className="h-4 w-4" aria-hidden="true" />
            {locationLabel}
          </p>
        </div>
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-canvas ring-1 ring-line">
          <Icon className="h-6 w-6 text-brand-deep" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="km-num text-[2.75rem] font-extrabold leading-none tracking-tight text-ink">
          {weather.tempC}°C
        </p>
        <p className="text-base font-semibold text-ink">{tl(description.label)}</p>
      </div>

      <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-line pt-4">
        <div>
          <dt className="flex items-center gap-1 text-xs font-semibold text-ink-muted">
            <DropletsIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {t('weather.rainToday')}
          </dt>
          <dd className="km-num mt-1 text-lg font-bold text-ink">{weather.rainChanceToday}%</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs font-semibold text-ink-muted">
            <ThermometerIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {t('weather.feelsLike')}
          </dt>
          <dd className="km-num mt-1 text-lg font-bold text-ink">{weather.feelsLikeC}°C</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs font-semibold text-ink-muted">
            <WindIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {t('weather.wind')}
          </dt>
          <dd className="km-num mt-1 text-lg font-bold text-ink">{weather.windKph} km/h</dd>
        </div>
      </dl>

      {status === 'fallback' ?
      <Notice
        className="mt-4"
        tone="offline"
        message={t('weather.saved')}
        action={
        <Button variant="secondary" className="min-h-[36px] px-3 text-sm" onClick={onRetry}>
              {t('action.retry')}
            </Button>
        } /> :


      <p className="mt-3 text-xs font-medium text-ink-muted">
          {t('weather.updated', { time: formatTime(weather.observedAt) })}
        </p>
      }
    </Card>);

}