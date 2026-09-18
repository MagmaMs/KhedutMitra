import React, { createContext, useContext, useMemo, useState } from 'react';

export type WeatherDemoState = 'normal' | 'loading' | 'error' | 'fallback' | 'noLocation';
export type PriceDemoState = 'normal' | 'loading' | 'error' | 'empty' | 'cached';

interface DemoContextValue {
  weatherState: WeatherDemoState;
  priceState: PriceDemoState;
  setWeatherState: (state: WeatherDemoState) => void;
  setPriceState: (state: PriceDemoState) => void;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

/**
 * Presenter-only overrides so loading, error and fallback states can be shown on
 * demand during a demo. Exposed in Profile, never in the product UI itself.
 */
export function DemoProvider({ children }: {children: React.ReactNode;}) {
  const [weatherState, setWeatherState] = useState<WeatherDemoState>('normal');
  const [priceState, setPriceState] = useState<PriceDemoState>('normal');

  const value = useMemo(
    () => ({ weatherState, priceState, setWeatherState, setPriceState }),
    [weatherState, priceState]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemoState(): DemoContextValue {
  const context = useContext(DemoContext);
  if (!context) throw new Error('useDemoState must be used inside DemoProvider');
  return context;
}