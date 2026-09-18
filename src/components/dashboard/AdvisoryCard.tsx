import React from 'react';
import { AlertTriangleIcon, CheckCircle2Icon, InfoIcon } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { cn } from '../../utils/cn';
import type { Advisory, AdvisorySeverity } from '../../types';

const severityMeta: Record<
  AdvisorySeverity,
  {Icon: typeof InfoIcon;edge: string;badge: string;labelKey: string;}> =
{
  urgent: {
    Icon: AlertTriangleIcon,
    edge: 'border-l-accent',
    badge: 'bg-accent-soft text-accent',
    labelKey: 'advisory.urgent'
  },
  caution: {
    Icon: InfoIcon,
    edge: 'border-l-accent/50',
    badge: 'bg-accent-soft text-accent',
    labelKey: 'advisory.caution'
  },
  good: {
    Icon: CheckCircle2Icon,
    edge: 'border-l-brand',
    badge: 'bg-brand-soft text-brand-deep',
    labelKey: 'advisory.good'
  }
};

export function AdvisoryCard({ advisories }: {advisories: Advisory[];}) {
  const { t } = useTranslation();
  if (advisories.length === 0) return null;

  const [primary, ...rest] = advisories;
  const meta = severityMeta[primary.severity];
  const PrimaryIcon = meta.Icon;

  return (
    <section aria-labelledby="advisory-heading" className="flex h-full flex-col">
      <div
        className={cn(
          'flex-1 rounded-lg border border-line border-l-4 bg-surface p-4 shadow-card sm:p-5',
          meta.edge
        )}>
        
        <div className="flex items-center justify-between gap-2">
          <h2 id="advisory-heading" className="text-sm font-bold uppercase tracking-wide text-ink-muted">
            {t('advisory.title')}
          </h2>
          <span
            className={cn(
              'inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold',
              meta.badge
            )}>
            
            <PrimaryIcon className="h-3.5 w-3.5" aria-hidden="true" />
            {t(meta.labelKey)}
          </span>
        </div>

        <h3 className="mt-3 text-xl font-extrabold leading-snug tracking-tight text-ink">
          {t(primary.titleKey)}
        </h3>
        <p className="mt-1.5 text-base leading-relaxed text-ink-muted">
          {t(primary.reasonKey, primary.params)}
        </p>

        {rest.length > 0 ?
        <div className="mt-4 border-t border-line pt-3">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-muted">{t('advisory.more')}</p>
            <ul className="mt-2 space-y-2">
              {rest.map((advisory) => {
              const RestIcon = severityMeta[advisory.severity].Icon;
              return (
                <li key={advisory.id} className="flex items-start gap-2">
                    <RestIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                    <p className="text-sm text-ink">
                      <span className="font-semibold">{t(advisory.titleKey)}</span>
                      <span className="text-ink-muted"> — {t(advisory.reasonKey, advisory.params)}</span>
                    </p>
                  </li>);

            })}
            </ul>
          </div> :
        null}
      </div>
    </section>);

}