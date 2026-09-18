import { cn } from '../utils/cn';
import type { ListingStatus } from '../types';

const toneClasses: Record<ListingStatus, {wrap: string;dot: string;}> = {
  active: { wrap: 'border-brand/30 bg-brand-soft text-brand-deep', dot: 'bg-brand' },
  sold: { wrap: 'border-line bg-canvas text-ink', dot: 'bg-ink' },
  withdrawn: { wrap: 'border-line bg-canvas text-ink-muted', dot: 'bg-ink-muted' }
};

export function StatusChip({ status, label }: {status: ListingStatus;label: string;}) {
  const tone = toneClasses[status];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2 py-1 text-xs font-bold',
        tone.wrap
      )}>
      
      <span className={cn('h-1.5 w-1.5 rounded-full', tone.dot)} aria-hidden="true" />
      {label}
    </span>);

}