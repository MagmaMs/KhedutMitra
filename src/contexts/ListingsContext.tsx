import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seedListings } from '../data/listings';
import type { DataStatus, Listing, ListingStatus } from '../types';

export interface NewListingInput {
  cropId: string;
  quantityKg: number;
  pricePerKg: number;
  farmerName: string;
  farmerPhone: string;
  village: string;
  district: string;
  state: string;
}

interface ListingsContextValue {
  listings: Listing[];
  status: DataStatus;
  /** Id of the listing created in this session, used to mark it as new. */
  lastCreatedId: string | null;
  reload: () => void;
  addListing: (input: NewListingInput) => Listing;
  setStatus: (id: string, status: ListingStatus) => void;
  setPrice: (id: string, pricePerKg: number) => void;
  getListing: (id: string) => Listing | undefined;
}

const ListingsContext = createContext<ListingsContextValue | undefined>(undefined);

export function ListingsProvider({ children }: {children: React.ReactNode;}) {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [status, setDataStatus] = useState<DataStatus>('loading');
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    setDataStatus('loading');
    const timer = window.setTimeout(() => setDataStatus('ready'), 550);
    return () => window.clearTimeout(timer);
  }, [reloadToken]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  const addListing = useCallback((input: NewListingInput) => {
    const listing: Listing = {
      id: `lst-${Date.now()}`,
      cropId: input.cropId,
      quantityKg: input.quantityKg,
      pricePerKg: input.pricePerKg,
      status: 'active',
      createdAt: new Date().toISOString(),
      farmerName: input.farmerName,
      farmerPhone: input.farmerPhone,
      village: input.village,
      district: input.district,
      state: input.state,
      ownedByUser: true
    };
    setListings((current) => [listing, ...current]);
    setLastCreatedId(listing.id);
    return listing;
  }, []);

  const setStatus = useCallback((id: string, next: ListingStatus) => {
    setListings((current) => current.map((item) => item.id === id ? { ...item, status: next } : item));
  }, []);

  const setPrice = useCallback((id: string, pricePerKg: number) => {
    setListings((current) => current.map((item) => item.id === id ? { ...item, pricePerKg } : item));
  }, []);

  const getListing = useCallback((id: string) => listings.find((item) => item.id === id), [listings]);

  const value = useMemo(
    () => ({ listings, status, lastCreatedId, reload, addListing, setStatus, setPrice, getListing }),
    [listings, status, lastCreatedId, reload, addListing, setStatus, setPrice, getListing]
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings(): ListingsContextValue {
  const context = useContext(ListingsContext);
  if (!context) throw new Error('useListings must be used inside ListingsProvider');
  return context;
}