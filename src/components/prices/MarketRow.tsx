import React from 'react';
import { CheckCircle2Icon } from 'lucide-react';
import { TrendIndicator } from '../TrendIndicator';
import { useTranslation } from '../../hooks/useTranslation';
import { formatRupees } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { MarketPrice } from '../../types';

interface MarketRowProps {
  price: MarketPrice;
  isBest: boolean;
}

export function MarketRow({ price, isBest }: MarketRowProps) {
  const { t } = useTranslation();

  return (
    <li
      className={cn(
        'rounded-lg border bg-surface p-4 shadow-card',
        'lg:grid lg:grid-cols-[1.7fr_1fr_1.1fr_1.3fr] lg:items-center lg:gap-4',
        isBest ? 'border-brand/40 border-l-4 border-l-brand' : 'border-line'
      )}>
      
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-bold text-ink">{price.marketName}</h3>
          {isBest ?
          <span className="inline-flex items-center gap-1 rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-deep">
              <CheckCircle2Icon className="h-3 w-3" aria-hidden="true" />
              {t('market.bestPrice')}
            </span> :
          null}
        </div>
        <p className="km-num mt-0.5 text-sm text-ink-muted">
          {price.districtName} · {t('market.away', { km: price.distanceKm })}
        </p>
      </div>

      <div className="mt-3 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('market.modal')}</p>
        <p className="km-num text-2xl font-extrabold leading-tight tracking-tight text-ink">
          {formatRupees(price.modalPrice)}
        </p>
      </div>

      <div className="mt-2 lg:mt-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
          {t('market.min')} – {t('market.max')}
        </p>
        <p className="km-num text-sm font-semibold text-ink">
          {formatRupees(price.minPrice)} – {formatRupees(price.maxPrice)}
        </p>
      </div>

      <div className="mt-2 lg:mt-0 lg:text-right">
        <TrendIndicator current={price.modalPrice} previous={price.previousModalPrice} />
      </div>
    </li>);

}