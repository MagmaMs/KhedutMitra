import React, { useId } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { cn } from '../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  suffix?: string;
  hideLabel?: boolean;
}

export function Input({ label, error, hint, suffix, hideLabel, className, id, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const describedBy = error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined;

  return (
    <div className="w-full">
      <label htmlFor={inputId} className={cn('mb-1.5 block text-sm font-semibold text-ink', hideLabel && 'sr-only')}>
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'km-num min-h-[48px] w-full rounded-lg border bg-white px-3.5 text-base text-ink',
            'placeholder:text-ink-muted/70 transition-[border-color] duration-150 ease-out-soft',
            error ? 'border-danger' : 'border-line hover:border-ink-muted/50',
            suffix && 'pr-14',
            className
          )}
          {...props} />
        
        {suffix ?
        <span className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-ink-muted">
            {suffix}
          </span> :
        null}
      </div>
      {error ?
      <p id={`${inputId}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p> :
      hint ?
      <p id={`${inputId}-hint`} className="mt-1.5 text-sm text-ink-muted">
          {hint}
        </p> :
      null}
    </div>);

}