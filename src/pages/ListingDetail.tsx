import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, CopyIcon, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { EmptyState } from '../components/EmptyState';
import { Notice } from '../components/Notice';
import { SkeletonCard } from '../components/Skeleton';
import { useListings } from '../contexts/ListingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { findCrop } from '../data/crops';
import { formatDate, formatNumber, formatRupees } from '../utils/format';

export function ListingDetail() {
  const { t, tl } = useLanguage();
  const { id } = useParams<{id: string;}>();
  const { getListing, status } = useListings();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [revealed, setRevealed] = useState(false);

  const listing = id ? getListing(id) : undefined;

  if (status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <SkeletonCard lines={4} />
      </div>);

  }

  if (!listing) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <EmptyState
          title={t('marketplace.notFound')}
          body={t('marketplace.notFoundBody')}
          action={<Button onClick={() => navigate('/marketplace')}>{t('marketplace.title')}</Button>} />
        
      </div>);

  }

  const crop = findCrop(listing.cropId);
  const cropName = crop ? tl(crop.name) : listing.cropId;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <Link
        to="/marketplace"
        className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-brand-deep">
        
        <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
        {t('marketplace.title')}
      </Link>

      <Card>
        <h1 className="text-3xl font-extrabold tracking-tight text-ink">{cropName}</h1>
        <p className="km-num mt-1 text-base font-semibold text-ink-muted">
          {formatNumber(listing.quantityKg)} {t('common.kg')}
        </p>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-t border-line pt-4">
          <div>
            <p className="text-sm font-semibold text-ink-muted">{t('listing.price')}</p>
            <p className="km-num mt-1 text-4xl font-extrabold leading-none tracking-tight text-brand-deep">
              {formatRupees(listing.pricePerKg)}
              <span className="ml-1.5 text-sm font-semibold text-ink-muted">{t('common.perKg')}</span>
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-semibold text-ink-muted">{t('listing.total')}</p>
            <p className="km-num mt-1 text-2xl font-extrabold tracking-tight text-ink">
              {formatRupees(listing.quantityKg * listing.pricePerKg)}
            </p>
          </div>
        </div>

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <UserIcon className="h-4 w-4" aria-hidden="true" />
              {t('detail.farmer')}
            </dt>
            <dd className="font-bold text-ink">{listing.farmerName}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <MapPinIcon className="h-4 w-4" aria-hidden="true" />
              {t('detail.location')}
            </dt>
            <dd className="font-semibold text-ink">
              {listing.village}, {listing.district}, {listing.state}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{t('detail.postedOn')}</dt>
            <dd className="km-num font-semibold text-ink">{formatDate(listing.createdAt)}</dd>
          </div>
        </dl>
      </Card>

      {revealed ?
      <motion.div
        initial={{ opacity: 0, y: 6, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
        
          <Card>
            <p className="text-sm font-bold uppercase tracking-wide text-ink-muted">{t('detail.phoneLabel')}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <a
              href={`tel:${listing.farmerPhone.replace(/\s/g, '')}`}
              className="km-num inline-flex min-h-[44px] items-center gap-2 text-2xl font-extrabold tracking-tight text-brand-deep underline underline-offset-4">
              
                <PhoneIcon className="h-5 w-5" aria-hidden="true" />
                {listing.farmerPhone}
              </a>
              <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard?.writeText(listing.farmerPhone);
                showToast(t('action.copied'));
              }}>
              
                <CopyIcon className="h-4 w-4" aria-hidden="true" />
                {t('action.copy')}
              </Button>
            </div>
          </Card>
        </motion.div> :

      <Button size="lg" fullWidth onClick={() => setRevealed(true)}>
          <PhoneIcon className="h-5 w-5" aria-hidden="true" />
          {t('action.contactFarmer')}
        </Button>
      }

      <Notice message={t('detail.pickupNote')} />
    </div>);

}