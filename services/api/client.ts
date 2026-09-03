import axios from 'axios';
import Constants from 'expo-constants';

/**
 * Shared axios client. Point `extra.apiUrl` in app.json when backend is ready.
 * Screens should never call axios directly — use feature services.
 */
const apiUrl =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl ??
  'https://api.example.com';

export const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Central place for auth refresh / logging later
    return Promise.reject(error);
  },
);
