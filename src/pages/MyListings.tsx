import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PackageIcon, PlusIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { SkeletonCard } from '../components/Skeleton';
import { MyListingRow } from '../components/listings/MyListingRow';
import { useListings } from '../contexts/ListingsContext';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from '../hooks/useTranslation';
import { cn } from '../utils/cn';
import type { ListingStatus } from '../types';

const tabs: ListingStatus[] = ['active', 'sold', 'withdrawn'];

const emptyCopy: Record<ListingStatus, {title: string;body: string;}> = {
  active: { title: 'listing.emptyActive', body: 'listing.emptyActiveBody' },
  sold: { title: 'listing.emptySold', body: 'listing.emptySoldBody' },
  withdrawn: { title: 'listing.emptyWithdrawn', body: 'listing.emptyWithdrawnBody' }
};

export function MyListings() {
  const { t } = useTranslation();
  const { listings, status, reload, setStatus, setPrice } = useListings();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ListingStatus>('active');

  const mine = listings.filter((listing) => listing.ownedByUser);
  const visible = mine.filter((listing) => listing.status === activeTab);
  const counts: Record<ListingStatus, number> = {
    active: mine.filter((listing) => listing.status === 'active').length,
    sold: mine.filter((listing) => listing.status === 'sold').length,
    withdrawn: mine.filter((listing) => listing.status === 'withdrawn').length
  };

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('listing.myTitle')}</h1>
        <Button onClick={() => navigate('/sell')}>
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          {t('action.sellProduce')}
        </Button>
      </header>

      <div role="tablist" aria-label={t('listing.myTitle')} className="flex gap-1 border-b border-line">
        {tabs.map((tab) => {
          const selected = tab === activeTab;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'relative min-h-[44px] whitespace-nowrap px-3 text-sm font-bold transition-colors duration-150 ease-out-soft',
                selected ? 'text-brand-deep' : 'text-ink-muted hover:text-ink'
              )}>
              
              <span className="km-num">
                {t(`listing.${tab}`)} ({counts[tab]})
              </span>
              {selected ?
              <motion.span
                layoutId="listing-tab-underline"
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" /> :

              null}
            </button>);

        })}
      </div>

      {status === 'loading' ?
      <div className="space-y-3" aria-busy="true" aria-label={t('common.loading')}>
          <SkeletonCard lines={2} />
          <SkeletonCard lines={2} />
        </div> :
      status === 'error' ?
      <ErrorState
        title={t('listing.errorTitle')}
        body={t('market.errorBody')}
        retryLabel={t('action.retry')}
        onRetry={reload} /> :

      visible.length === 0 ?
      <EmptyState
        icon={PackageIcon}
        title={t(emptyCopy[activeTab].title)}
        body={t(emptyCopy[activeTab].body)}
        action={
        activeTab === 'active' ?
        <Button onClick={() => navigate('/sell')}>
                <PlusIcon className="h-4 w-4" aria-hidden="true" />
                {t('action.sellProduce')}
              </Button> :
        undefined
        } /> :


      <ul className="space-y-3">
          {visible.map((listing) =>
        <MyListingRow
          key={listing.id}
          listing={listing}
          onMarkSold={(id) => {
            setStatus(id, 'sold');
            showToast(t('listing.markedSold'));
          }}
          onWithdraw={(id) => {
            setStatus(id, 'withdrawn');
            showToast(t('listing.withdrawnToast'));
          }}
          onRelist={(id) => {
            setStatus(id, 'active');
            showToast(t('listing.relistedToast'));
          }}
          onSavePrice={(id, price) => {
            setPrice(id, price);
            showToast(t('listing.priceUpdated'));
          }} />

        )}
        </ul>
      }
    </div>);

}