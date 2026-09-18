import { Link } from 'react-router-dom';
import { ArrowRightIcon, PackageIcon, PlusIcon } from 'lucide-react';
import { Card } from '../Card';
import { Skeleton } from '../Skeleton';
import { useTranslation } from '../../hooks/useTranslation';

interface ListingsSummaryProps {
  activeCount: number;
  loading: boolean;
}

export function ListingsSummary({ activeCount, loading }: ListingsSummaryProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <Card>
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-3 h-4 w-24" />
      </Card>);

  }

  return (
    <Card className="flex flex-wrap items-center justify-between gap-3">
      <p className="flex items-center gap-2 text-base font-bold text-ink">
        <PackageIcon className="h-5 w-5 text-brand-deep" aria-hidden="true" />
        {activeCount === 1 ? t('listing.activeCountOne') : t('listing.activeCount', { count: activeCount })}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/sell"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg bg-brand px-3.5 text-sm font-bold text-white transition-colors duration-150 ease-out-soft hover:bg-brand-deep">
          
          <PlusIcon className="h-4 w-4" aria-hidden="true" />
          {t('action.sellProduce')}
        </Link>
        <Link
          to="/listings"
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-lg border border-line px-3.5 text-sm font-bold text-brand-deep transition-colors duration-150 ease-out-soft hover:bg-brand-soft">
          
          {t('action.manageListings')}
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </Card>);

}