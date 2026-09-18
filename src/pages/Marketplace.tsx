import { useMemo, useState } from 'react';
import { SearchIcon, StoreIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { Select } from '../components/Select';
import { Skeleton } from '../components/Skeleton';
import { ListingCard } from '../components/listings/ListingCard';
import { useListings } from '../contexts/ListingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { findCrop } from '../data/crops';
import { cn } from '../utils/cn';

export function Marketplace() {
  const { t, tl } = useLanguage();
  const { listings, status, reload, lastCreatedId } = useListings();

  const [query, setQuery] = useState('');
  const [cropFilter, setCropFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');

  const active = useMemo(
    () =>
    listings.
    filter((listing) => listing.status === 'active').
    sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [listings]
  );

  const cropChips = useMemo(() => {
    const ids = Array.from(new Set(active.map((listing) => listing.cropId)));
    return ids.map((id) => {
      const crop = findCrop(id);
      return { id, label: crop ? tl(crop.name) : id };
    });
  }, [active, tl]);

  const districts = useMemo(
    () => Array.from(new Set(active.map((listing) => listing.district))).sort(),
    [active]
  );

  const results = active.filter((listing) => {
    const crop = findCrop(listing.cropId);
    const cropName = crop ? tl(crop.name).toLowerCase() : listing.cropId;
    const matchesQuery =
    query.trim().length === 0 ||
    cropName.includes(query.trim().toLowerCase()) ||
    listing.farmerName.toLowerCase().includes(query.trim().toLowerCase());
    const matchesCrop = cropFilter === 'all' || listing.cropId === cropFilter;
    const matchesDistrict = districtFilter === 'all' || listing.district === districtFilter;
    return matchesQuery && matchesCrop && matchesDistrict;
  });

  const filtersApplied = query.length > 0 || cropFilter !== 'all' || districtFilter !== 'all';

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('marketplace.title')}</h1>
        <p className="mt-1 text-base text-ink-muted">{t('marketplace.subtitle')}</p>
      </header>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <label htmlFor="marketplace-search" className="sr-only">
              {t('marketplace.search')}
            </label>
            <SearchIcon
              className="pointer-events-none absolute inset-y-0 left-3.5 my-auto h-5 w-5 text-ink-muted"
              aria-hidden="true" />
            
            <input
              id="marketplace-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('marketplace.search')}
              className="min-h-[48px] w-full rounded-lg border border-line bg-white pl-11 pr-3.5 text-base text-ink placeholder:text-ink-muted/70 transition-[border-color] duration-150 ease-out-soft hover:border-ink-muted/50" />
            
          </div>
          <div className="sm:w-56">
            <Select
              label={t('marketplace.allDistricts')}
              hideLabel
              value={districtFilter}
              onChange={(event) => setDistrictFilter(event.target.value)}
              options={[
              { value: 'all', label: t('marketplace.allDistricts') },
              ...districts.map((district) => ({ value: district, label: district }))]
              } />
            
          </div>
        </div>

        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div className="flex w-max gap-2 pb-1">
            <button
              type="button"
              onClick={() => setCropFilter('all')}
              aria-pressed={cropFilter === 'all'}
              className={cn(
                'min-h-[40px] whitespace-nowrap rounded-lg border px-3.5 text-sm font-bold transition-colors duration-150 ease-out-soft',
                cropFilter === 'all' ?
                'border-brand bg-brand text-white' :
                'border-line bg-surface text-ink hover:border-ink-muted/50'
              )}>
              
              {t('marketplace.allCrops')}
            </button>
            {cropChips.map((chip) =>
            <button
              key={chip.id}
              type="button"
              onClick={() => setCropFilter(chip.id)}
              aria-pressed={cropFilter === chip.id}
              className={cn(
                'min-h-[40px] whitespace-nowrap rounded-lg border px-3.5 text-sm font-bold transition-colors duration-150 ease-out-soft',
                cropFilter === chip.id ?
                'border-brand bg-brand text-white' :
                'border-line bg-surface text-ink hover:border-ink-muted/50'
              )}>
              
                {chip.label}
              </button>
            )}
          </div>
        </div>
      </div>

      {status === 'loading' ?
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label={t('common.loading')}>
          {Array.from({ length: 6 }).map((_, index) =>
        <li key={index} className="rounded-lg border border-line bg-surface p-4 shadow-card">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="mt-3 h-7 w-24" />
              <Skeleton className="mt-4 h-3 w-36" />
              <Skeleton className="mt-2 h-3 w-24" />
            </li>
        )}
        </ul> :
      status === 'error' ?
      <ErrorState
        title={t('marketplace.errorTitle')}
        body={t('market.errorBody')}
        retryLabel={t('action.retry')}
        onRetry={reload} /> :

      results.length === 0 ?
      <EmptyState
        icon={StoreIcon}
        title={t('marketplace.emptyTitle')}
        body={t('marketplace.emptyBody')}
        action={
        filtersApplied ?
        <Button
          variant="secondary"
          onClick={() => {
            setQuery('');
            setCropFilter('all');
            setDistrictFilter('all');
          }}>
          
                {t('action.clearFilters')}
              </Button> :
        undefined
        } /> :


      <>
          <p className="km-num text-sm font-semibold text-ink-muted">
            {t('marketplace.results', { count: results.length })}
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((listing) =>
          <ListingCard key={listing.id} listing={listing} isNew={listing.id === lastCreatedId} />
          )}
          </ul>
        </>
      }
    </div>);

}