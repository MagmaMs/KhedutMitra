import React from 'react';
import { cn } from '../utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: 'div' | 'section' | 'article' | 'li';
  padded?: boolean;
}

export function Card({ as = 'div', padded = true, className, children, ...props }: CardProps) {
  const Tag = as;
  return (
    <Tag
      className={cn(
        'rounded-lg border border-line bg-surface shadow-card',
        padded && 'p-4 sm:p-5',
        className
      )}
      {...props}>
      
      {children}
    </Tag>);

}

export function CardTitle({ children, className }: {children: React.ReactNode;className?: string;}) {
  return (
    <h2 className={cn('text-sm font-bold uppercase tracking-wide text-ink-muted', className)}>{children}</h2>);

}