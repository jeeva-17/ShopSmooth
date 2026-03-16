/**
 * ShopSmooth API Service
 * Centralized API client for all backend calls
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text().catch(() => response.statusText);
      return {
        status: response.status,
        error: typeof error === 'string' ? error : 'API request failed',
      };
    }

    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  } catch (error) {
    return {
      status: 0,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

/**
 * Products API
 */
export const productsAPI = {
  list: (storeId: string) =>
    apiCall(`/stores/${storeId}/products?limit=100`),
  get: (storeId: string, productId: string) =>
    apiCall(`/stores/${storeId}/products/${productId}`),
  create: (storeId: string, payload: Record<string, any>) =>
    apiCall(`/stores/${storeId}/products`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  update: (storeId: string, productId: string, payload: Record<string, any>) =>
    apiCall(`/stores/${storeId}/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
  delete: (storeId: string, productId: string) =>
    apiCall(`/stores/${storeId}/products/${productId}`, {
      method: 'DELETE',
    }),
};

/**
 * Orders API
 */
export const ordersAPI = {
  list: (storeId: string) =>
    apiCall(`/stores/${storeId}/orders?limit=100`),
  get: (storeId: string, orderId: string) =>
    apiCall(`/stores/${storeId}/orders/${orderId}`),
  updateStatus: (storeId: string, orderId: string, status: string) =>
    apiCall(`/stores/${storeId}/orders/${orderId}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};

/**
 * Customers API
 */
export const customersAPI = {
  list: (storeId: string) =>
    apiCall(`/stores/${storeId}/customers?limit=100`),
  get: (storeId: string, customerId: string) =>
    apiCall(`/stores/${storeId}/customers/${customerId}`),
};

/**
 * Store Settings API
 */
export const storeSettingsAPI = {
  get: (storeId: string) =>
    apiCall(`/stores/${storeId}`),
  update: (storeId: string, payload: Record<string, any>) =>
    apiCall(`/stores/${storeId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),
};
