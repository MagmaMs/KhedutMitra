# Internationalization (i18n) Strategy

## 1. Overview
KhedutMitra targets rural Indian populations. Multi-lingual support is not a feature; it is a fundamental requirement. We support:
- English (`en`) - Default
- Hindi (`hi`)
- Gujarati (`gu`)

## 2. Implementation Architecture
We utilize a custom React Context (`LanguageContext`) paired with localized JSON dictionaries.

### 2.1 File Structure
```text
src/
  locales/
    en.json
    hi.json
    gu.json
  hooks/
    useTranslation.ts
  context/
    LanguageContext.tsx
```

### 2.2 The `useTranslation` Hook
Every UI component must use this hook for text rendering.

```typescript
import { useTranslation } from '@/hooks/useTranslation';

export const MyComponent = () => {
  const { t, language, setLanguage } = useTranslation();

  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <button onClick={() => setLanguage('gu')}>ગુજરાતી</button>
    </div>
  );
};
```

## 3. Translation Guidelines
- Avoid hardcoding text strings in JSX.
- Fallback to English if a specific key is missing in Hindi or Gujarati.
- Keys should be structured logically (e.g., `module.submodule.action`).
