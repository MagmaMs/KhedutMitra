import { useNavigate } from 'react-router-dom';
import { LogOutIcon, PhoneIcon, SproutIcon, StoreIcon, UserIcon } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Select } from '../components/Select';
import { LanguageToggle } from '../components/LanguageToggle';
import { useAuth } from '../contexts/AuthContext';
import { useDemoState, type PriceDemoState, type WeatherDemoState } from '../contexts/DemoContext';
import { useTranslation } from '../hooks/useTranslation';
import { findState, states } from '../data/locations';
import { cn } from '../utils/cn';
import type { Role } from '../types';

export function Profile() {
  const { t } = useTranslation();
  const { user, activeRole, setActiveRole, logout, updateLocation } = useAuth();
  const { weatherState, priceState, setWeatherState, setPriceState } = useDemoState();
  const navigate = useNavigate();

  const region = findState(user?.state ?? '');
  const districtOptions = (region?.districts ?? []).map((district) => ({
    value: district.id,
    label: district.name
  }));

  const roleOptions: Array<{id: Role;label: string;Icon: typeof SproutIcon;}> = [
  { id: 'farmer', label: t('auth.farmer'), Icon: SproutIcon },
  { id: 'buyer', label: t('auth.buyer'), Icon: StoreIcon }];


  return (
    <div className="mx-auto w-full max-w-2xl space-y-4">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{t('profile.title')}</h1>

      <Card>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{t('profile.account')}</h2>
        <p className="mt-3 flex items-center gap-2 text-lg font-bold text-ink">
          <UserIcon className="h-5 w-5 text-ink-muted" aria-hidden="true" />
          {user?.name}
        </p>
        <p className="km-num mt-1 flex items-center gap-2 text-sm font-medium text-ink-muted">
          <PhoneIcon className="h-4 w-4" aria-hidden="true" />
          {user?.phone}
        </p>

        <div className="mt-4 grid gap-4 border-t border-line pt-4 sm:grid-cols-2">
          <Select
            label={t('auth.state')}
            value={user?.state ?? ''}
            options={states.map((state) => ({ value: state.id, label: state.name }))}
            onChange={(event) => {
              const nextState = event.target.value;
              const firstDistrict = findState(nextState)?.districts[0];
              updateLocation(nextState, firstDistrict?.id ?? '');
            }} />
          
          <Select
            label={t('auth.district')}
            value={user?.district ?? ''}
            options={districtOptions}
            onChange={(event) => updateLocation(user?.state ?? '', event.target.value)} />
          
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{t('profile.language')}</h2>
        <div className="mt-3">
          <LanguageToggle tone="onLight" showFullLabels />
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{t('profile.viewAs')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('profile.viewAsHelp')}</p>
        <div role="radiogroup" aria-label={t('profile.viewAs')} className="mt-3 grid grid-cols-2 gap-2">
          {roleOptions.map((option) => {
            const selected = activeRole === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setActiveRole(option.id);
                  navigate(option.id === 'farmer' ? '/home' : '/marketplace');
                }}
                className={cn(
                  'flex min-h-[52px] items-center justify-center gap-2 rounded-lg border text-sm font-bold',
                  'transition-[background-color,border-color,color] duration-150 ease-out-soft',
                  selected ?
                  'border-brand bg-brand text-white' :
                  'border-line bg-surface text-ink hover:border-ink-muted/50'
                )}>
                
                <option.Icon className="h-4 w-4" aria-hidden="true" />
                {option.label}
              </button>);

          })}
        </div>
      </Card>

      <Card>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">{t('profile.demoTitle')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('profile.demoHelp')}</p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Select
            label={t('profile.weatherState')}
            value={weatherState}
            onChange={(event) => setWeatherState(event.target.value as WeatherDemoState)}
            options={[
            { value: 'normal', label: t('profile.stateNormal') },
            { value: 'loading', label: t('profile.stateLoading') },
            { value: 'fallback', label: t('profile.stateFallback') },
            { value: 'error', label: t('profile.stateError') },
            { value: 'noLocation', label: t('weather.noLocationTitle') }]
            } />
          
          <Select
            label={t('profile.priceState')}
            value={priceState}
            onChange={(event) => setPriceState(event.target.value as PriceDemoState)}
            options={[
            { value: 'normal', label: t('profile.stateNormal') },
            { value: 'loading', label: t('profile.stateLoading') },
            { value: 'cached', label: t('profile.stateFallback') },
            { value: 'empty', label: t('profile.stateEmpty') },
            { value: 'error', label: t('profile.stateError') }]
            } />
          
        </div>
      </Card>

      <Button
        variant="secondary"
        size="lg"
        fullWidth
        onClick={() => {
          logout();
          navigate('/');
        }}>
        
        <LogOutIcon className="h-4 w-4" aria-hidden="true" />
        {t('action.logout')}
      </Button>
    </div>);

}