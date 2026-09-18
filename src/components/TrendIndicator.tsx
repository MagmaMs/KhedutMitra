import { ArrowDownRightIcon, ArrowUpRightIcon, MinusIcon } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { formatRupees } from '../utils/format';
import { cn } from '../utils/cn';

interface TrendIndicatorProps {
  current: number;
  previous: number | null;
  className?: string;
  showSuffix?: boolean;
}

/** Arrow + word + amount, so the direction never depends on colour alone. */
export function TrendIndicator({ current, previous, className, showSuffix = true }: TrendIndicatorProps) {
  const { t } = useTranslation();
  if (previous === null) return <span className={cn('text-sm text-ink-muted', className)}>{t('market.flat')}</span>;
  const delta = current - previous;
  const isFlat = Math.abs(delta) < 5;

  const Icon = isFlat ? MinusIcon : delta > 0 ? ArrowUpRightIcon : ArrowDownRightIcon;
  const word = isFlat ? t('market.flat') : delta > 0 ? t('market.up') : t('market.down');
  const tone = isFlat ? 'text-ink-muted' : delta > 0 ? 'text-brand-deep' : 'text-accent';

  return (
    <span className={cn('inline-flex items-center gap-1 text-sm font-semibold', tone, className)}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span>{word}</span>
      {!isFlat ? <span className="km-num">{formatRupees(Math.abs(delta))}</span> : null}
      {showSuffix ? <span className="font-medium text-ink-muted">{t('market.vsYesterday')}</span> : null}
    </span>);

}