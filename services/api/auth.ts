import { apiClient } from './client';
import { parseApiError } from './errors';
import { clearSession, saveSession, saveTokens } from './tokenStorage';

import type {
  AuthResponse,
  GoogleAuthPayload,
  LoginPayload,
  RegisterPayload,
  TokenRefreshResponse,
} from '@/types/auth';
import type { ApiResult } from '@/types/home';

function toFailure(error: unknown): ApiResult<never> {
  const parsed = parseApiError(error);
  return {
    ok: false,
    error: {
      code: parsed.status ? `HTTP_${parsed.status}` : 'NETWORK',
      message: parsed.message,
      fields: parsed.fields,
      status: parsed.status,
      retryAfter: parsed.retryAfter,
    },
  };
}

/**
 * POST /auth/register/
 */
export async function register(
  payload: RegisterPayload,
): Promise<ApiResult<AuthResponse>> {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/register/', payload);
    await saveSession({ access: data.access, refresh: data.refresh }, data.user);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * POST /auth/login/
 */
export async function login(payload: LoginPayload): Promise<ApiResult<AuthResponse>> {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/login/', payload);
    await saveSession({ access: data.access, refresh: data.refresh }, data.user);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * POST /auth/google/
 * Front must obtain Google ID token (GIS credential) first.
 */
export async function loginWithGoogle(
  payload: GoogleAuthPayload,
): Promise<ApiResult<AuthResponse>> {
  try {
    const { data } = await apiClient.post<AuthResponse>('/auth/google/', payload);
    await saveSession({ access: data.access, refresh: data.refresh }, data.user);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * POST /auth/token/refresh/
 * Usually handled by apiClient interceptor; exposed for manual use.
 */
export async function refreshTokens(
  refresh: string,
): Promise<ApiResult<TokenRefreshResponse>> {
  try {
    const { data } = await apiClient.post<TokenRefreshResponse>('/auth/token/refresh/', {
      refresh,
    });
    await saveTokens(data);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * POST /auth/logout/ — revokes refresh; always clears local session.
 */
export async function logout(refresh: string | null): Promise<ApiResult<null>> {
  try {
    if (refresh) {
      await apiClient.post('/auth/logout/', { refresh }, { validateStatus: (s) => s === 204 || s < 500 });
    }
  } catch {
    // Backend returns 204 even for unknown tokens; still clear local state.
  } finally {
    await clearSession();
  }
  return { ok: true, data: null, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
}
