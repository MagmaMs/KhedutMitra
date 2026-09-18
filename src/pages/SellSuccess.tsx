import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2Icon, MapPinIcon, UserIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useListings } from '../contexts/ListingsContext';
import { useLanguage } from '../contexts/LanguageContext';
import { findCrop } from '../data/crops';
import { formatNumber, formatRupees } from '../utils/format';

export function SellSuccess() {
  const { t, tl } = useLanguage();
  const { lastCreatedId, getListing } = useListings();
  const navigate = useNavigate();

  const listing = lastCreatedId ? getListing(lastCreatedId) : undefined;
  if (!listing) return <Navigate to="/sell" replace />;

  const crop = findCrop(listing.cropId);
  const cropName = crop ? tl(crop.name) : listing.cropId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
      className="mx-auto w-full max-w-xl">
      
      <div className="text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
          <CheckCircle2Icon className="h-7 w-7 text-brand" aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t('sell.successTitle')}
        </h1>
        <p className="mt-1.5 text-base text-ink-muted">{t('sell.successBody')}</p>
      </div>

      <Card className="mt-6">
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{t('sell.buyersSee')}</h2>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-xl font-extrabold tracking-tight text-ink">{cropName}</p>
            <p className="km-num mt-0.5 text-sm font-semibold text-ink-muted">
              {formatNumber(listing.quantityKg)} {t('common.kg')}
            </p>
          </div>
          <div className="text-right">
            <p className="km-num text-2xl font-extrabold leading-none tracking-tight text-brand-deep">
              {formatRupees(listing.pricePerKg)}
            </p>
            <p className="text-xs font-semibold text-ink-muted">{t('common.perKg')}</p>
          </div>
        </div>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-ink-muted">{t('listing.total')}</dt>
            <dd className="km-num font-bold text-ink">
              {formatRupees(listing.quantityKg * listing.pricePerKg)}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <UserIcon className="h-4 w-4" aria-hidden="true" />
              {t('detail.farmer')}
            </dt>
            <dd className="font-semibold text-ink">{listing.farmerName}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-1.5 text-ink-muted">
              <MapPinIcon className="h-4 w-4" aria-hidden="true" />
              {t('detail.location')}
            </dt>
            <dd className="font-semibold text-ink">
              {listing.village}, {listing.district}
            </dd>
          </div>
        </dl>
      </Card>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" fullWidth onClick={() => navigate(`/marketplace/${listing.id}`)}>
          {t('action.viewInMarketplace')}
        </Button>
        <Button size="lg" variant="secondary" fullWidth onClick={() => navigate('/home')}>
          {t('action.backHome')}
        </Button>
      </div>
    </motion.div>);

}