import React from 'react';
import { Card } from '../Card';
import { useTranslation } from '../../hooks/useTranslation';
import { formatRupees, formatShortDate } from '../../utils/format';
import type { PricePoint } from '../../types';

interface PriceTrendChartProps {
  points: PricePoint[];
  marketName: string;
}

const WIDTH = 320;
const HEIGHT = 96;

export function PriceTrendChart({ points, marketName }: PriceTrendChartProps) {
  const { t } = useTranslation();
  if (points.length < 2) return null;

  const values = points.map((point) => point.modalPrice);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  const coords = points.map((point, index) => {
    const x = index / (points.length - 1) * WIDTH;
    const y = HEIGHT - (point.modalPrice - min) / range * (HEIGHT - 14) - 7;
    return { x, y };
  });

  const line = coords.map((coord, index) => `${index === 0 ? 'M' : 'L'}${coord.x.toFixed(1)},${coord.y.toFixed(1)}`).join(' ');
  const area = `${line} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;

  const delta = values[values.length - 1] - values[0];
  const caption =
  Math.abs(delta) < 5 ?
  t('market.trendFlat') :
  delta > 0 ?
  t('market.trendUp', { amount: formatRupees(Math.abs(delta)) }) :
  t('market.trendDown', { amount: formatRupees(Math.abs(delta)) });

  return (
    <Card as="section" aria-labelledby="trend-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="trend-heading" className="text-sm font-bold uppercase tracking-wide text-ink-muted">
          {t('market.trend7')}
        </h2>
        <p className="km-num text-sm font-medium text-ink-muted">
          {marketName} · <span className="font-bold text-ink">{formatRupees(values[values.length - 1])}</span>
        </p>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        preserveAspectRatio="none"
        className="mt-3 h-[96px] w-full"
        role="img"
        aria-label={caption}>
        
        <path d={area} fill="#15803d" opacity="0.08" />
        <path
          d={line}
          fill="none"
          stroke="#15803d"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke" />
        
      </svg>

      <div className="km-num mt-1 flex justify-between text-[11px] font-medium text-ink-muted">
        <span>{formatShortDate(points[0].date)}</span>
        <span>{formatShortDate(points[points.length - 1].date)}</span>
      </div>
      <p className="mt-2 text-sm font-semibold text-ink">{caption}</p>
    </Card>);

}