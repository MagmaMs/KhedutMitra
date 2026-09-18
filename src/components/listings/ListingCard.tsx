import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, SparklesIcon, UserIcon } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { findCrop } from '../../data/crops';
import { formatNumber, formatRupees, timeAgo } from '../../utils/format';
import { cn } from '../../utils/cn';
import type { Listing } from '../../types';

interface ListingCardProps {
  listing: Listing;
  isNew?: boolean;
}

export function ListingCard({ listing, isNew = false }: ListingCardProps) {
  const { t, tl } = useLanguage();
  const crop = findCrop(listing.cropId);
  const cropName = crop ? tl(crop.name) : listing.cropId;

  return (
    <li className="h-full">
      <Link
        to={`/marketplace/${listing.id}`}
        className={cn(
          'flex h-full flex-col rounded-lg border bg-surface p-4 shadow-card',
          'transition-[border-color,transform] duration-150 ease-out-soft hover:-translate-y-0.5 hover:border-brand/50',
          isNew ? 'border-brand/50' : 'border-line'
        )}>
        
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-lg font-extrabold leading-tight tracking-tight text-ink">{cropName}</h3>
            <p className="km-num mt-0.5 text-sm font-semibold text-ink-muted">
              {formatNumber(listing.quantityKg)} {t('common.kg')}
            </p>
          </div>
          {isNew ?
          <span className="inline-flex shrink-0 items-center gap-1 rounded bg-brand-soft px-1.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-brand-deep">
              <SparklesIcon className="h-3 w-3" aria-hidden="true" />
              {t('marketplace.new')}
            </span> :
          null}
        </div>

        <div className="mt-3">
          <p className="km-num text-2xl font-extrabold leading-none tracking-tight text-ink">
            {formatRupees(listing.pricePerKg)}
            <span className="ml-1.5 text-xs font-semibold text-ink-muted">{t('common.perKg')}</span>
          </p>
          <p className="km-num mt-1 text-sm font-medium text-ink-muted">
            {t('listing.total')}: {formatRupees(listing.quantityKg * listing.pricePerKg)}
          </p>
        </div>

        <div className="mt-auto space-y-1 border-t border-line pt-3 text-sm text-ink-muted">
          <p className="flex items-center gap-1.5 font-semibold text-ink">
            <UserIcon className="h-4 w-4 text-ink-muted" aria-hidden="true" />
            {listing.farmerName}
          </p>
          <p className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4" aria-hidden="true" />
            {listing.village}, {listing.district}
          </p>
          <p className="km-num text-xs">{timeAgo(listing.createdAt)}</p>
        </div>
      </Link>
    </li>);

}