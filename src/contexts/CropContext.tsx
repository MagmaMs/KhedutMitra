import React, { createContext, useContext, useMemo, useState } from 'react';

interface CropContextValue {
  selectedCropId: string;
  setSelectedCropId: (cropId: string) => void;
}

const CropContext = createContext<CropContextValue | undefined>(undefined);

/** The crop the farmer is tracking, shared between the dashboard and the mandi screen. */
export function CropProvider({ children }: {children: React.ReactNode;}) {
  const [selectedCropId, setSelectedCropId] = useState('cotton');
  const value = useMemo(() => ({ selectedCropId, setSelectedCropId }), [selectedCropId]);
  return <CropContext.Provider value={value}>{children}</CropContext.Provider>;
}

export function useSelectedCrop(): CropContextValue {
  const context = useContext(CropContext);
  if (!context) throw new Error('useSelectedCrop must be used inside CropProvider');
  return context;
}