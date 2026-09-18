import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRightIcon,
  CloudRainIcon,
  HandshakeIcon,
  IndianRupeeIcon,
  CheckCircle2Icon } from
'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useTranslation } from '../hooks/useTranslation';

const values = [
{ icon: CloudRainIcon, titleKey: 'landing.value1', bodyKey: 'landing.value1Body' },
{ icon: IndianRupeeIcon, titleKey: 'landing.value2', bodyKey: 'landing.value2Body' },
{ icon: HandshakeIcon, titleKey: 'landing.value3', bodyKey: 'landing.value3Body' }];


const loopSteps = ['landing.loop1', 'landing.loop2', 'landing.loop3', 'landing.loop4'];

export function Landing() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="space-y-10 py-2 sm:space-y-14 sm:py-6">
      <section className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
        <div>
          <h1 className="text-4xl font-extrabold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            {t('app.name')}
          </h1>
          <p className="mt-3 text-xl font-bold leading-snug text-brand-deep sm:text-2xl">{t('app.tagline')}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            {t('landing.heroBody')}
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate('/signup')} className="sm:px-7">
              {t('action.getStarted')}
              <ArrowRightIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="secondary" onClick={() => navigate('/marketplace')}>
              {t('action.browseMarketplace')}
            </Button>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="font-bold text-brand-deep underline underline-offset-2">
              {t('action.login')}
            </Link>
          </p>
        </div>

        {/* An honest glimpse of the product rather than decoration. */}
        <div className="space-y-3" aria-hidden="true">
          <Card className="flex items-center justify-between">
            <div>
              <p className="km-num text-4xl font-extrabold leading-none tracking-tight text-ink">31°C</p>
              <p className="mt-1.5 text-sm font-medium text-ink-muted">Partly cloudy · Anand, Gujarat</p>
            </div>
            <CloudRainIcon className="h-9 w-9 text-brand-deep" />
          </Card>
          <Card className="border-l-4 border-l-accent">
            <p className="text-xs font-bold uppercase tracking-wide text-accent">{t('advisory.title')}</p>
            <p className="mt-1.5 text-lg font-extrabold leading-snug text-ink">{t('adv.delaySpray.title')}</p>
            <p className="mt-1 text-sm text-ink-muted">{t('adv.delaySpray.reason', { hours: 18 })}</p>
          </Card>
          <Card>
            <p className="text-sm font-semibold text-ink-muted">{t('market.bestToday')}</p>
            <p className="km-num mt-1 text-3xl font-extrabold leading-none tracking-tight text-brand-deep">
              ₹7,820
              <span className="ml-1.5 text-xs font-semibold text-ink-muted">{t('market.perQuintal')}</span>
            </p>
            <p className="mt-1.5 text-sm font-semibold text-ink">Vadodara APMC · 42 km</p>
          </Card>
        </div>
      </section>

      <section aria-labelledby="values-heading">
        <h2 id="values-heading" className="sr-only">
          {t('landing.loopTitle')}
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {values.map((value) =>
          <li key={value.titleKey} className="flex h-full flex-col rounded-lg border border-line bg-surface p-5 shadow-card">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft">
                <value.icon className="h-5 w-5 text-brand-deep" aria-hidden="true" />
              </span>
              <h3 className="mt-3.5 text-lg font-bold leading-snug tracking-tight text-ink">{t(value.titleKey)}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted">{t(value.bodyKey)}</p>
            </li>
          )}
        </ul>
      </section>

      <section aria-labelledby="loop-heading" className="rounded-lg border border-line bg-surface p-5 shadow-card sm:p-7">
        <h2 id="loop-heading" className="text-lg font-bold tracking-tight text-ink">
          {t('landing.loopTitle')}
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {loopSteps.map((step, index) =>
          <li key={step} className="flex items-start gap-2.5">
              <span className="km-num mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-soft text-xs font-extrabold text-brand-deep">
                {index + 1}
              </span>
              <p className="text-base font-semibold text-ink">{t(step)}</p>
            </li>
          )}
        </ol>
        <p className="mt-5 flex items-center gap-2 border-t border-line pt-4 text-sm text-ink-muted">
          <CheckCircle2Icon className="h-4 w-4 text-brand" aria-hidden="true" />
          {t('detail.pickupNote')}
        </p>
      </section>
    </div>);

}