import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';

import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from './tokenStorage';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const FALLBACK_API_URL = 'http://169.58.192.208:8005/api/v1/';

function resolveApiUrl(): string {
  const extra = (Constants.expoConfig?.extra ??
    (Constants as { manifest?: { extra?: Record<string, unknown> } }).manifest?.extra) as
    | { apiUrl?: string }
    | undefined;

  const raw = (extra?.apiUrl ?? FALLBACK_API_URL).trim();
  // Backend expects trailing slash: http://host:8005/api/v1/
  return raw.endsWith('/') ? raw : `${raw}/`;
}

const apiUrl = resolveApiUrl();

export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

/** Raw client without auth interceptors — used for refresh to avoid loops. */
const refreshClient = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

let refreshPromise: Promise<string | null> | null = null;

async function rotateTokens(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) {
    await clearSession();
    return null;
  }

  try {
    const { data } = await refreshClient.post<{ access: string; refresh: string }>(
      'auth/token/refresh/',
      { refresh },
    );
    await saveTokens({ access: data.access, refresh: data.refresh });
    return data.access;
  } catch {
    await clearSession();
    return null;
  }
}

function refreshAccessToken(): Promise<string | null> {
  if (!refreshPromise) {
    refreshPromise = rotateTokens().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const url = original?.url ?? '';

    const isAuthEndpoint =
      url.includes('auth/login/') ||
      url.includes('auth/register/') ||
      url.includes('auth/google/') ||
      url.includes('auth/token/refresh/') ||
      url.includes('auth/logout/');

    if (status !== 401 || !original || original._retry || isAuthEndpoint) {
      return Promise.reject(error);
    }

    original._retry = true;
    const access = await refreshAccessToken();
    if (!access) {
      return Promise.reject(error);
    }

    original.headers.Authorization = `Bearer ${access}`;
    return apiClient(original);
  },
);
