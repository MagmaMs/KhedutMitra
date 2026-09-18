import React from 'react';
import { cn } from '../utils/cn';

export function Skeleton({ className }: {className?: string;}) {
  return <div className={cn('animate-pulse rounded bg-line/70', className)} aria-hidden="true" />;
}

export function SkeletonCard({ lines = 3, className }: {lines?: number;className?: string;}) {
  return (
    <div className={cn('rounded-lg border border-line bg-surface p-4 shadow-card sm:p-5', className)}>
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-3 h-8 w-40" />
      {Array.from({ length: lines }).map((_, index) =>
      <Skeleton key={index} className={cn('mt-2.5 h-3', index % 2 === 0 ? 'w-full' : 'w-2/3')} />
      )}
    </div>);

}