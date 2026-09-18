import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';

type CardTag = 'div' | 'section' | 'article' | 'li';

interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardTag;
  padded?: boolean;
}

export function Card({ as: Tag = 'div', padded = true, className, children, ...props }: CardProps) {
  return (
    <Tag
      className={cn(
        'rounded-lg border border-line bg-surface shadow-card',
        padded && 'p-4 sm:p-5',
        className
      )}
      {...props}>
      {children}
    </Tag>
  );
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('text-sm font-bold uppercase tracking-wide text-ink-muted', className)}>{children}</h2>
  );
}