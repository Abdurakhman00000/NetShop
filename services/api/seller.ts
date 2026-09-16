import { apiClient } from './client';
import { parseApiError } from './errors';

import type { Paginated } from '@/types/common';
import type { ApiResult } from '@/types/home';
import type {
  CreateSellerProductPayload,
  CreateStorePayload,
  SellerProduct,
  SellerProductListParams,
  Store,
} from '@/types/seller';

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

/** GET /me/store/ */
export async function fetchMyStore(): Promise<ApiResult<Store>> {
  try {
    const { data } = await apiClient.get<Store>('/me/store/');
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/** POST /me/store/ */
export async function createStore(
  payload: CreateStorePayload,
): Promise<ApiResult<Store>> {
  try {
    const { data } = await apiClient.post<Store>('/me/store/', payload);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/** GET /seller/products/ */
export async function fetchSellerProducts(
  params: SellerProductListParams = {},
): Promise<ApiResult<Paginated<SellerProduct>>> {
  try {
    const { data } = await apiClient.get<Paginated<SellerProduct>>('/seller/products/', {
      params,
    });
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/** POST /seller/products/ — creates draft */
export async function createSellerProduct(
  payload: CreateSellerProductPayload,
): Promise<ApiResult<SellerProduct | CreateSellerProductPayload>> {
  try {
    const { data } = await apiClient.post<SellerProduct | CreateSellerProductPayload>(
      '/seller/products/',
      payload,
    );
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}
