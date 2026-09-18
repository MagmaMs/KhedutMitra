import React from 'react';
import { formatRupees } from '../utils/format';
import { cn } from '../utils/cn';

interface PriceValueProps {
  value: number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses: Record<NonNullable<PriceValueProps['size']>, string> = {
  sm: 'text-lg',
  md: 'text-2xl',
  lg: 'text-3xl',
  xl: 'text-4xl sm:text-[2.75rem]'
};

export function PriceValue({ value, unit, size = 'md', className }: PriceValueProps) {
  return (
    <p className={cn('km-num font-extrabold leading-none tracking-tight text-ink', sizeClasses[size], className)}>
      {formatRupees(value)}
      {unit ? <span className="ml-1.5 text-xs font-semibold text-ink-muted">{unit}</span> : null}
    </p>);

}