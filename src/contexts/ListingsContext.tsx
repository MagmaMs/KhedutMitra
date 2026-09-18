import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { seedListings } from '../data/listings';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
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
  lastCreatedId: string | null;
  reload: () => void;
  addListing: (input: NewListingInput) => Promise<Listing>;
  setStatus: (id: string, status: ListingStatus) => Promise<void>;
  setPrice: (id: string, pricePerKg: number) => Promise<void>;
  getListing: (id: string) => Listing | undefined;
}

const ListingsContext = createContext<ListingsContextValue | undefined>(undefined);

export function ListingsProvider({ children }: {children: React.ReactNode;}) {
  const { user } = useAuth();
  const [listings, setListings] = useState<Listing[]>([]);
  const [status, setDataStatus] = useState<DataStatus>('loading');
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;
    
    async function fetchListings() {
      setDataStatus('loading');
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase
            .from('crop_listings')
            .select('*')
            .order('created_at', { ascending: false });
          
          if (!error && data) {
            const mapped = data.map((d: any) => ({
              id: d.id,
              cropId: d.crop_id,
              quantityKg: parseFloat(d.quantity_kg),
              pricePerKg: parseFloat(d.price_per_kg),
              status: d.status,
              farmerName: d.farmer_name,
              farmerPhone: d.farmer_phone,
              village: d.village,
              district: d.district,
              state: d.state,
              createdAt: d.created_at,
              ownedByUser: user?.id === d.farmer_id
            }));
            if (active) {
              setListings(mapped);
              setDataStatus('ready');
            }
            return;
          }
        } catch (e) {
          console.error("Supabase listing fetch failed", e);
        }
      }

      // Fallback
      if (active) {
        setListings(seedListings.map(l => ({...l, ownedByUser: l.ownedByUser || false})));
        setDataStatus('ready');
      }
    }

    fetchListings();

    return () => { active = false; };
  }, [reloadToken, user?.id]);

  const reload = useCallback(() => setReloadToken((token) => token + 1), []);

  const addListing = useCallback(async (input: NewListingInput): Promise<Listing> => {
    if (isSupabaseConfigured && supabase && user) {
      const { data, error } = await supabase.from('crop_listings').insert({
        farmer_id: user.id,
        crop_id: input.cropId,
        quantity_kg: input.quantityKg,
        price_per_kg: input.pricePerKg,
        status: 'active',
        farmer_name: input.farmerName,
        farmer_phone: input.farmerPhone,
        village: input.village,
        district: input.district,
        state: input.state
      }).select().single();

      if (!error && data) {
        const listing: Listing = {
          id: data.id,
          cropId: data.crop_id,
          quantityKg: parseFloat(data.quantity_kg),
          pricePerKg: parseFloat(data.price_per_kg),
          status: data.status,
          farmerName: data.farmer_name,
          farmerPhone: data.farmer_phone,
          village: data.village,
          district: data.district,
          state: data.state,
          createdAt: data.created_at,
          ownedByUser: true
        };
        setListings((current) => [listing, ...current]);
        setLastCreatedId(listing.id);
        return listing;
      }
    }
    
    // Fallback
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
  }, [user]);

  const setStatus = useCallback(async (id: string, next: ListingStatus) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('crop_listings').update({ status: next }).eq('id', id);
    }
    setListings((current) => current.map((item) => item.id === id ? { ...item, status: next } : item));
  }, []);

  const setPrice = useCallback(async (id: string, pricePerKg: number) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('crop_listings').update({ price_per_kg: pricePerKg }).eq('id', id);
    }
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