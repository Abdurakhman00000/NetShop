import { apiClient } from './client';
import { parseApiError } from './errors';

import type { Paginated } from '@/types/common';
import type { ApiResult } from '@/types/home';
import type { ServiceDetail, ServiceListItem, ServiceListParams } from '@/types/service';

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

/** GET /services/ */
export async function fetchServices(
  params: ServiceListParams = {},
): Promise<ApiResult<Paginated<ServiceListItem>>> {
  try {
    const { data } = await apiClient.get<Paginated<ServiceListItem>>('/services/', {
      params,
    });
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/** GET /services/{id}/ */
export async function fetchService(
  id: string,
): Promise<ApiResult<ServiceDetail>> {
  try {
    const { data } = await apiClient.get<ServiceDetail>(`/services/${id}/`);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}
