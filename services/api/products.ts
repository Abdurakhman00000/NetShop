import { apiClient } from './client';
import { parseApiError } from './errors';

import type { Paginated } from '@/types/common';
import type { ApiResult } from '@/types/home';
import type { ProductDetail, ProductListItem, ProductListParams } from '@/types/product';

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

/** GET /products/ */
export async function fetchProducts(
  params: ProductListParams = {},
): Promise<ApiResult<Paginated<ProductListItem>>> {
  try {
    const { data } = await apiClient.get<Paginated<ProductListItem>>('/products/', {
      params,
    });
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/** GET /products/{id}/ */
export async function fetchProduct(
  id: string,
): Promise<ApiResult<ProductDetail>> {
  try {
    const { data } = await apiClient.get<ProductDetail>(`/products/${id}/`);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}
