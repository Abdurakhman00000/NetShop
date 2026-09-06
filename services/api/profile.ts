import { apiClient } from './client';
import { parseApiError } from './errors';
import { saveUser } from './tokenStorage';

import type { UpdateProfilePayload, User } from '@/types/auth';
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
    },
  };
}

/**
 * GET /me/
 */
export async function fetchMe(): Promise<ApiResult<User>> {
  try {
    const { data } = await apiClient.get<User>('/me/');
    await saveUser(data);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * PATCH /me/
 */
export async function updateMe(
  payload: UpdateProfilePayload,
): Promise<ApiResult<User>> {
  try {
    const { data } = await apiClient.patch<User>('/me/', payload);
    await saveUser(data);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}
