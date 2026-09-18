import React from 'react';
import { cn } from '../utils/cn';

type Variant = 'primary' | 'secondary' | 'quiet' | 'danger';
type Size = 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-brand text-white border border-brand hover:bg-brand-deep hover:border-brand-deep',
  secondary: 'bg-white text-ink border border-line hover:border-ink-muted',
  quiet: 'bg-transparent text-brand border border-transparent hover:bg-brand-soft',
  danger: 'bg-white text-danger border border-line hover:border-danger'
};

const sizeClasses: Record<Size, string> = {
  md: 'min-h-[44px] px-4 text-sm',
  lg: 'min-h-[52px] px-5 text-base'
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-semibold',
        'transition-[background-color,border-color,color,transform] duration-150 ease-out-soft',
        'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        className
      )}
      {...props} />);


}