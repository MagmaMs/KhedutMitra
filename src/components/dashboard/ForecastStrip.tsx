import { DropletIcon } from 'lucide-react';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';
import { describeWeather } from '../../data/weatherCodes';
import { useLanguage } from '../../contexts/LanguageContext';
import { formatShortDate, formatWeekday } from '../../utils/format';
import type { ForecastDay } from '../../types';

interface ForecastStripProps {
  days: ForecastDay[];
  loading?: boolean;
}

export function ForecastStrip({ days, loading = false }: ForecastStripProps) {
  const { t, tl } = useLanguage();

  return (
    <Card as="section" aria-labelledby="forecast-heading">
      <h2 id="forecast-heading" className="text-sm font-bold uppercase tracking-wide text-ink-muted">
        {t('weather.forecast')}
      </h2>
      <ul className="mt-3 grid grid-cols-5 gap-2">
        {loading ?
        Array.from({ length: 5 }).map((_, index) => <Skeleton key={index} className="h-[104px] rounded-lg" />) :
        days.slice(0, 5).map((day, index) => {
          const description = describeWeather(day.code);
          const Icon = description.Icon;
          return (
            <li
              key={day.date}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-line bg-canvas px-1 py-2.5 text-center">
              
                  <p className="text-xs font-bold text-ink">
                    {index === 0 ? t('common.today') : formatWeekday(day.date)}
                  </p>
                  <p className="text-[10px] font-medium text-ink-muted">{formatShortDate(day.date)}</p>
                  <Icon className="h-5 w-5 text-brand-deep" aria-hidden="true" />
                  <span className="sr-only">{tl(description.label)}</span>
                  <p className="km-num text-sm font-extrabold text-ink">{day.maxTempC}°</p>
                  <p className="km-num text-[11px] font-medium text-ink-muted">{day.minTempC}°</p>
                  <p className="km-num flex items-center gap-0.5 text-[11px] font-bold text-accent">
                    <DropletIcon className="h-3 w-3" aria-hidden="true" />
                    {day.rainChance}%
                  </p>
                </li>);

        })}
      </ul>
    </Card>);

}