import { apiClient } from './client';
import { parseApiError } from './errors';

import type { ApiResult } from '@/types/home';
import type { Category, CategoryKind, City, Paginated } from '@/types/common';

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

/** GET /categories/?kind= */
export async function fetchCategories(
  kind: CategoryKind,
): Promise<ApiResult<Category[]>> {
  try {
    const { data } = await apiClient.get<Category[]>('/categories/', {
      params: { kind },
    });
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/** GET /cities/ */
export async function fetchCities(search?: string): Promise<ApiResult<City[]>> {
  try {
    const { data } = await apiClient.get<City[]>('/cities/', {
      params: search ? { search } : undefined,
    });
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

export type { Paginated };
