import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { translations } from '../data/translations';
import type { Language, Localized } from '../types';

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /** Translate a dictionary key, with optional {token} substitution. */
  t: (key: string, params?: Record<string, string | number>) => string;
  /** Read a value that already carries all three languages, e.g. a crop name. */
  tl: (value: Localized) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const languageOptions: Array<{id: Language;label: string;short: string;}> = [
{ id: 'en', label: 'English', short: 'EN' },
{ id: 'hi', label: 'हिन्दी', short: 'हि' },
{ id: 'gu', label: 'ગુજરાતી', short: 'ગુ' }];


export function LanguageProvider({ children }: {children: React.ReactNode;}) {
  const [language, setLanguage] = useState<Language>('en');

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const entry = translations[key];
      let text = entry ? entry[language] : key;
      if (params) {
        Object.entries(params).forEach(([token, value]) => {
          text = text.replace(new RegExp(`\\{${token}\\}`, 'g'), String(value));
        });
      }
      return text;
    },
    [language]
  );

  const tl = useCallback((value: Localized) => value[language], [language]);

  const contextValue = useMemo(() => ({ language, setLanguage, t, tl }), [language, t, tl]);

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used inside LanguageProvider');
  return context;
}