import { Link } from 'react-router-dom';
import { ArrowRightIcon, MapPinIcon } from 'lucide-react';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';
import { TrendIndicator } from '../TrendIndicator';
import { useTranslation } from '../../hooks/useTranslation';
import { formatRupees } from '../../utils/format';
import type { MarketPrice } from '../../types';

interface MarketSnapshotProps {
  cropName: string;
  best: MarketPrice | null;
  loading: boolean;
  districtName: string;
}

export function MarketSnapshot({ cropName, best, loading, districtName }: MarketSnapshotProps) {
  const { t } = useTranslation();

  return (
    <Card as="section" aria-labelledby="snapshot-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="snapshot-heading" className="text-sm font-bold uppercase tracking-wide text-ink-muted">
          {t('market.snapshot')}
        </h2>
        <span className="rounded border border-line bg-canvas px-2 py-1 text-xs font-bold text-ink">
          {cropName}
        </span>
      </div>

      {loading ?
      <>
          <Skeleton className="mt-4 h-9 w-44" />
          <Skeleton className="mt-3 h-3.5 w-36" />
        </> :
      best ?
      <>
          <p className="mt-3 text-sm font-semibold text-ink-muted">{t('market.bestToday')}</p>
          <p className="km-num mt-1 text-3xl font-extrabold leading-none tracking-tight text-brand-deep">
            {formatRupees(best.modalPrice)}
            <span className="ml-1.5 text-xs font-semibold text-ink-muted">{t('market.perQuintal')}</span>
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-ink">
            <MapPinIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            {best.marketName}
            <span className="km-num font-medium text-ink-muted">
              · {t('market.away', { km: best.distanceKm })}
            </span>
          </p>
          <TrendIndicator className="mt-2" current={best.modalPrice} previous={best.previousModalPrice} />
        </> :

      <p className="mt-3 text-sm text-ink-muted">
          {t('market.emptyBody', { crop: cropName, district: districtName })}
        </p>
      }

      <Link
        to="/prices"
        className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-3.5 text-sm font-bold text-brand-deep transition-colors duration-150 ease-out-soft hover:bg-brand-soft">
        
        {t('action.viewPrices')}
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </Link>
    </Card>);

}