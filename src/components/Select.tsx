import React, { useId } from 'react';
import { AlertCircleIcon, ChevronDownIcon } from 'lucide-react';
import { cn } from '../utils/cn';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  hint?: string;
  hideLabel?: boolean;
}

export function Select({
  label,
  options,
  placeholder,
  error,
  hint,
  hideLabel = false,
  className,
  id,
  ...props
}: SelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  const describedBy = error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined;

  return (
    <div className="w-full">
      <label
        htmlFor={selectId}
        className={cn('mb-1.5 block text-sm font-semibold text-ink', hideLabel && 'sr-only')}>
        
        {label}
      </label>
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={cn(
            'min-h-[48px] w-full appearance-none rounded-lg border bg-white px-3.5 pr-10 text-base font-medium text-ink',
            'transition-[border-color] duration-150 ease-out-soft',
            error ? 'border-danger' : 'border-line hover:border-ink-muted/50',
            className
          )}
          {...props}>
          
          {placeholder ?
          <option value="" disabled>
              {placeholder}
            </option> :
          null}
          {options.map((option) =>
          <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )}
        </select>
        <ChevronDownIcon
          className="pointer-events-none absolute inset-y-0 right-3.5 my-auto h-5 w-5 text-ink-muted"
          aria-hidden="true" />
        
      </div>
      {error ?
      <p id={`${selectId}-error`} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
          <AlertCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </p> :
      hint ?
      <p id={`${selectId}-hint`} className="mt-1.5 text-sm text-ink-muted">
          {hint}
        </p> :
      null}
    </div>);

}