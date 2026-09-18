import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon } from 'lucide-react';
import { Select } from '../components/Select';
import { Skeleton, SkeletonCard } from '../components/Skeleton';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Notice } from '../components/Notice';
import { BestMarketPanel } from '../components/prices/BestMarketPanel';
import { MarketRow } from '../components/prices/MarketRow';
import { PriceTrendChart } from '../components/prices/PriceTrendChart';
import { useAuth } from '../contexts/AuthContext';
import { useSelectedCrop } from '../contexts/CropContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useMarketPrices } from '../hooks/useMarketPrices';
import { crops, findCrop } from '../data/crops';
import { getPriceHistory } from '../data/markets';
import { findDistrict, findState } from '../data/locations';
import { formatDate } from '../utils/format';

export function Prices() {
  const { t, tl } = useLanguage();
  const { user } = useAuth();
  const { selectedCropId, setSelectedCropId } = useSelectedCrop();

  const stateId = user?.state ?? '';
  const districtId = user?.district ?? '';
  const district = findDistrict(stateId, districtId);
  const region = findState(stateId);

  const { status, prices, refetch } = useMarketPrices(selectedCropId, stateId, districtId);
  const crop = findCrop(selectedCropId);
  const cropName = crop ? tl(crop.name) : selectedCropId;
  const best = prices[0] ?? null;

  const history = useMemo(
    () => best ? getPriceHistory(selectedCropId, best.marketId) : [],
    [best, selectedCropId]
  );

  const cropOptions = crops.map((item) => ({ value: item.id, label: tl(item.name) }));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('market.title')}</h1>
        <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-ink-muted">
          <MapPinIcon className="h-4 w-4" aria-hidden="true" />
          {district?.name}
          {region ? `, ${region.name}` : ''}
          <Link to="/profile" className="font-bold text-brand-deep underline underline-offset-2">
            {t('weather.setLocation')}
          </Link>
        </p>
      </header>

      <div className="max-w-sm">
        <Select
          label={t('market.selectCrop')}
          value={selectedCropId}
          options={cropOptions}
          onChange={(event) => setSelectedCropId(event.target.value)} />
        
      </div>

      {status === 'fallback' ? <Notice tone="offline" message={t('market.cached')} /> : null}

      {status === 'loading' ?
      <div className="space-y-3" aria-busy="true" aria-label={t('common.loading')}>
          <SkeletonCard lines={2} />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) =>
          <div key={index} className="rounded-lg border border-line bg-surface p-4 shadow-card">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="mt-3 h-7 w-32" />
                <Skeleton className="mt-2 h-3 w-48" />
              </div>
          )}
          </div>
        </div> :
      status === 'error' ?
      <ErrorState
        title={t('market.errorTitle')}
        body={t('market.errorBody')}
        retryLabel={t('action.retry')}
        onRetry={refetch} /> :

      status === 'empty' || !best ?
      <EmptyState
        title={t('market.emptyTitle')}
        body={t('market.emptyBody', { crop: cropName, district: district?.name ?? '' })} /> :


      <>
          <BestMarketPanel best={best} />

          <section aria-labelledby="markets-heading">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 id="markets-heading" className="text-lg font-bold tracking-tight text-ink">
                {t('market.compare')}
              </h2>
              <p className="km-num text-sm text-ink-muted">
                {t('market.asOf', { date: formatDate(best.arrivalDate) })}
              </p>
            </div>

            <div className="mt-2 hidden grid-cols-[1.7fr_1fr_1.1fr_1.3fr] gap-4 px-4 pb-1 lg:grid">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">{t('market.market')}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">{t('market.modal')}</span>
              <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
                {t('market.min')} – {t('market.max')}
              </span>
              <span className="text-xs font-bold uppercase tracking-wide text-ink-muted lg:text-right">
                {t('market.vsYesterday')}
              </span>
            </div>

            <ul className="space-y-3">
              {prices.map((price, index) =>
            <MarketRow key={price.marketId} price={price} isBest={index === 0} />
            )}
            </ul>
          </section>

          <PriceTrendChart points={history} marketName={best.marketName} />
        </>
      }
    </div>);

}