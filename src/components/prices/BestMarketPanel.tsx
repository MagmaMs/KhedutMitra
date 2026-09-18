import React from 'react';
import { CheckCircle2Icon, MapPinIcon } from 'lucide-react';
import { TrendIndicator } from '../TrendIndicator';
import { useTranslation } from '../../hooks/useTranslation';
import { formatDate, formatRupees } from '../../utils/format';
import type { MarketPrice } from '../../types';

export function BestMarketPanel({ best }: {best: MarketPrice;}) {
  const { t } = useTranslation();

  return (
    <section
      aria-labelledby="best-market-heading"
      className="rounded-lg border border-brand/40 bg-surface p-5 shadow-card">
      
      <p
        id="best-market-heading"
        className="inline-flex items-center gap-1.5 rounded bg-brand-soft px-2 py-1 text-xs font-bold uppercase tracking-wide text-brand-deep">
        
        <CheckCircle2Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {t('market.bestToday')}
      </p>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div>
          <p className="km-num text-4xl font-extrabold leading-none tracking-tight text-brand-deep sm:text-[2.75rem]">
            {formatRupees(best.modalPrice)}
            <span className="ml-2 text-sm font-semibold text-ink-muted">{t('market.perQuintal')}</span>
          </p>
          <p className="mt-2.5 flex flex-wrap items-center gap-x-2 text-base font-bold text-ink">
            <MapPinIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            {best.marketName}
            <span className="km-num text-sm font-medium text-ink-muted">
              · {t('market.away', { km: best.distanceKm })}
            </span>
          </p>
        </div>
        <div className="text-left sm:text-right">
          <TrendIndicator current={best.modalPrice} previous={best.previousModalPrice} />
          <p className="km-num mt-1 text-xs font-medium text-ink-muted">
            {t('market.asOf', { date: formatDate(best.arrivalDate) })}
          </p>
        </div>
      </div>
    </section>);

}