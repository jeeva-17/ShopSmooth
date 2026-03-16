import Cookies from 'js-cookie';
import { api } from './api';

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  store?: {
    id: number;
    name: string;
    slug: string;
    logo?: string;
  };
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  store_name?: string;
}

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const COOKIE_OPTIONS = {
  expires: 7,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const auth = {
  setToken(token: string): void {
    Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
  },

  setRefreshToken(token: string): void {
    Cookies.set(REFRESH_TOKEN_KEY, token, COOKIE_OPTIONS);
  },

  getToken(): string | undefined {
    return Cookies.get(TOKEN_KEY);
  },

  getRefreshToken(): string | undefined {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  removeTokens(): void {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!Cookies.get(TOKEN_KEY);
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login/', { email, password });
    auth.setToken(response.access);
    if (response.refresh) {
      auth.setRefreshToken(response.refresh);
    }
    return response;
  },

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/register/', data);
    if (response.access) {
      auth.setToken(response.access);
    }
    if (response.refresh) {
      auth.setRefreshToken(response.refresh);
    }
    return response;
  },

  async logout(): Promise<void> {
    try {
      const refresh = auth.getRefreshToken();
      if (refresh) {
        await api.post('/auth/logout/', { refresh });
      }
    } catch {
      // Ignore logout API errors
    } finally {
      auth.removeTokens();
    }
  },

  async getUser(): Promise<User> {
    return api.get<User>('/auth/me/');
  },

  async refreshToken(): Promise<string> {
    const refresh = auth.getRefreshToken();
    if (!refresh) throw new Error('No refresh token');

    const response = await api.post<{ access: string }>('/auth/token/refresh/', { refresh });
    auth.setToken(response.access);
    return response.access;
  },
};

export default auth;
