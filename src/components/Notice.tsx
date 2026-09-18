import React from 'react';
import { InfoIcon, WifiOffIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface NoticeProps {
  message: string;
  tone?: 'info' | 'offline';
  action?: React.ReactNode;
  className?: string;
}

/** Used for "showing saved data" style messages — icon plus words, never colour alone. */
export function Notice({ message, tone = 'info', action, className }: NoticeProps) {
  const Icon = tone === 'offline' ? WifiOffIcon : InfoIcon;
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-accent/30 bg-accent-soft px-3.5 py-2.5',
        className
      )}
      role="status">
      
      <Icon className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      <p className="min-w-0 flex-1 text-sm font-medium text-ink">{message}</p>
      {action}
    </div>);

}