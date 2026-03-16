import { useState } from 'react';
import { api } from '../api';

interface UpdatePayload {
  [key: string]: any;
}

export function useStoreSettings(storeId: number) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAppearance = async (colors: UpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/stores/${storeId}/appearance`, colors);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update appearance';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePayment = async (data: UpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/stores/${storeId}/payment`, data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update payment settings';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateDelivery = async (data: UpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/stores/${storeId}/delivery`, data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update delivery settings';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePages = async (data: UpdatePayload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/stores/${storeId}/pages`, data);
      return response;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update pages';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateAppearance,
    updatePayment,
    updateDelivery,
    updatePages,
  };
}
