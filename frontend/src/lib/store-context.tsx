'use client';

import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { api } from './api';

export interface Store {
  id: number;
  name: string;
  slug: string;
  description?: string;
  navbar_primary_color: string;
  navbar_secondary_color: string;
  navbar_text_color: string;
  accent_color: string;
  delivery_charge: number;
  free_delivery_above: number;
  estimated_delivery_days: number;
  enable_online_payment: boolean;
  enable_cod: boolean;
  about_us?: string;
  privacy_policy?: string;
  terms_conditions?: string;
  return_policy?: string;
  shipping_policy?: string;
}

interface StoreContextType {
  store: Store | null;
  loading: boolean;
  error: string | null;
  updateStore: (data: Partial<Store>) => Promise<void>;
  refreshStore: () => Promise<void>;
  storeId: number | null;
  setStoreId: (id: number) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [storeId, setStoreId] = useState<number | null>(null);

  const fetchStore = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Store>(`/stores/${id}`);
      setStore(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch store');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) {
      fetchStore(storeId);
    }
  }, [storeId]);

  const updateStore = async (data: Partial<Store>) => {
    if (!storeId) throw new Error('Store ID not set');
    try {
      const response = await api.put<Store>(`/stores/${storeId}`, data);
      setStore(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update store');
      throw err;
    }
  };

  const refreshStore = async () => {
    if (storeId) {
      await fetchStore(storeId);
    }
  };

  return (
    <StoreContext.Provider value={{ store, loading, error, updateStore, refreshStore, storeId, setStoreId }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}
