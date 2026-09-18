import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPinIcon } from 'lucide-react';
import { WeatherCard } from '../components/dashboard/WeatherCard';
import { AdvisoryCard } from '../components/dashboard/AdvisoryCard';
import { ForecastStrip } from '../components/dashboard/ForecastStrip';
import { MarketSnapshot } from '../components/dashboard/MarketSnapshot';
import { ListingsSummary } from '../components/dashboard/ListingsSummary';
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

      <div className="grid gap-4 lg:grid-cols-2">
        <MarketSnapshot
          cropName={cropName}
          best={prices[0] ?? null}
          loading={priceLoading}
          districtName={district?.name ?? ''} />
        
        <ListingsSummary activeCount={activeCount} loading={listingsStatus === 'loading'} />
      </div>
    </div>);

}