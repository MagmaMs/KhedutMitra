import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPinIcon,
  BugIcon,
  LightbulbIcon,
  LandmarkIcon,
  UsersIcon,
  ShoppingBagIcon,
} from 'lucide-react';
import { WeatherCard } from '../components/dashboard/WeatherCard';
import { AdvisoryCard } from '../components/dashboard/AdvisoryCard';
import { ForecastStrip } from '../components/dashboard/ForecastStrip';
import { MarketSnapshot } from '../components/dashboard/MarketSnapshot';
import { ListingsSummary } from '../components/dashboard/ListingsSummary';
import { Card } from '../components/Card';
import { SkeletonCard } from '../components/Skeleton';
import { Notice } from '../components/Notice';
import { useAuth } from '../contexts/AuthContext';
import { useListings } from '../contexts/ListingsContext';
import { useSelectedCrop } from '../contexts/CropContext';
import { useTranslation } from '../hooks/useTranslation';
import { useLanguage } from '../contexts/LanguageContext';
import { useWeather } from '../hooks/useWeather';
import { useMarketPrices } from '../hooks/useMarketPrices';
import { findDistrict, findState } from '../data/locations';
import { findCrop } from '../data/crops';
import { buildAdvisories } from '../utils/advisory';

function greetingKey(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'greeting.morning';
  if (hour < 17) return 'greeting.afternoon';
  return 'greeting.evening';
}

/** Compact dashboard link card for secondary features */
function DashboardLink({
  icon: Icon,
  title,
  subtitle,
  cta,
  to,
}: {
  icon: typeof BugIcon;
  title: string;
  subtitle: string;
  cta: string;
  to: string;
}) {
  const navigate = useNavigate();
  return (
    <Card
      as="article"
      className="flex cursor-pointer flex-col justify-between transition-[border-color] duration-150 ease-out-soft hover:border-ink-muted/50"
      onClick={() => navigate(to)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter') navigate(to); }}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft">
          <Icon className="h-4.5 w-4.5 text-brand-deep" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-ink">{title}</h3>
          <p className="mt-0.5 text-xs text-ink-muted line-clamp-2">{subtitle}</p>
        </div>
      </div>
      <p className="mt-3 text-xs font-bold text-brand-deep">{cta} →</p>
    </Card>
  );
}

export function Home() {
  const { t } = useTranslation();
  const { tl } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { selectedCropId } = useSelectedCrop();
  const { listings, status: listingsStatus } = useListings();

  const stateId = user?.state ?? '';
  const districtId = user?.district ?? '';
  const district = findDistrict(stateId, districtId);
  const region = findState(stateId);
  const locationLabel = district && region ? `${district.name}, ${region.name}` : '';

  const { status: weatherStatus, weather, refetch } = useWeather(district);
  const { status: priceStatus, prices } = useMarketPrices(selectedCropId, stateId, districtId);

  const crop = findCrop(selectedCropId);
  const cropName = crop ? tl(crop.name) : selectedCropId;
  const advisories = useMemo(() => weather ? buildAdvisories(weather) : [], [weather]);
  const activeCount = listings.filter((listing) => listing.ownedByUser && listing.status === 'active').length;

  const weatherLoading = weatherStatus === 'loading';
  const priceLoading = priceStatus === 'loading';

  return (
    <div className="space-y-4">
      {/* ── Greeting ──────────────────────────────────────────── */}
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          {t(greetingKey())}, {user?.name ?? ''}
        </h1>
        {locationLabel ?
        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-ink-muted">
            <MapPinIcon className="h-4 w-4" aria-hidden="true" />
            {locationLabel}
          </p> :
        null}
      </header>

      {/* ── Primary: Weather + Advisory ───────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <WeatherCard
          status={weatherStatus}
          weather={weather}
          locationLabel={locationLabel}
          onRetry={refetch}
          onSetLocation={() => navigate('/profile')} />

        {weatherLoading ?
        <SkeletonCard lines={2} /> :
        advisories.length > 0 ?
        <AdvisoryCard advisories={advisories} /> :
        <Notice message={t('weather.errorBody')} tone="offline" />
        }
      </div>

      <ForecastStrip days={weather?.forecast ?? []} loading={weatherLoading} />

      {/* ── Secondary: Market + Listings ──────────────────────── */}
      <div className="grid gap-4 lg:grid-cols-2">
        <MarketSnapshot
          cropName={cropName}
          best={prices[0] ?? null}
          loading={priceLoading}
          districtName={district?.name ?? ''} />

        <ListingsSummary activeCount={activeCount} loading={listingsStatus === 'loading'} />
      </div>

      {/* ── Discovery: Feature cards ─────────────────────────── */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">{t('dashboard.features')}</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardLink
            icon={BugIcon}
            title={t('dashboard.diseaseTitle')}
            subtitle={t('dashboard.diseaseSubtitle')}
            cta={t('dashboard.diseaseAction')}
            to="/disease-tracker"
          />
          <DashboardLink
            icon={LightbulbIcon}
            title={t('dashboard.adviceTitle')}
            subtitle={t('dashboard.adviceSubtitle')}
            cta={t('dashboard.adviceAction')}
            to="/crop-advice"
          />
          <DashboardLink
            icon={ShoppingBagIcon}
            title={t('dashboard.marketTitle')}
            subtitle={t('dashboard.marketSubtitle')}
            cta={t('dashboard.marketAction')}
            to="/market"
          />
          <DashboardLink
            icon={LandmarkIcon}
            title={t('dashboard.schemesTitle')}
            subtitle={t('dashboard.schemesSubtitle')}
            cta={t('dashboard.schemesAction')}
            to="/schemes"
          />
          <DashboardLink
            icon={UsersIcon}
            title={t('dashboard.communityTitle')}
            subtitle={t('dashboard.communitySubtitle')}
            cta={t('dashboard.communityAction')}
            to="/community"
          />
        </div>
      </section>
    </div>);
}