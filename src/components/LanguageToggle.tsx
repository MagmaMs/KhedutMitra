import React from 'react';
import { languageOptions, useLanguage } from '../contexts/LanguageContext';
import { cn } from '../utils/cn';

interface LanguageToggleProps {
  tone?: 'onDark' | 'onLight';
  showFullLabels?: boolean;
}

export function LanguageToggle({ tone = 'onDark', showFullLabels = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const onDark = tone === 'onDark';

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className={cn(
        'flex items-center gap-0.5 rounded-lg border p-0.5',
        onDark ? 'border-white/20 bg-white/10' : 'border-line bg-canvas'
      )}>
      
      {languageOptions.map((option) => {
        const selected = option.id === language;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={option.label}
            onClick={() => setLanguage(option.id)}
            className={cn(
              'min-h-[36px] whitespace-nowrap rounded-md px-2.5 text-sm font-bold',
              'transition-[background-color,color] duration-150 ease-out-soft',
              showFullLabels && 'min-h-[44px] flex-1 px-3',
              selected ?
              onDark ?
              'bg-white text-brand-deep' :
              'bg-brand text-white' :
              onDark ?
              'text-white/80 hover:text-white' :
              'text-ink-muted hover:text-ink'
            )}>
            
            {showFullLabels ? option.label : option.short}
          </button>);

      })}
    </div>);

}