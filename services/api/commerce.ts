import { apiClient } from './client';
import { parseApiError } from './errors';

import type {
  AddCartItemPayload,
  Cart,
  CheckoutPayload,
  Order,
  OrderListParams,
} from '@/types/commerce';
import type { Paginated } from '@/types/common';
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

/** GET /me/cart/ */
export async function fetchCart(): Promise<ApiResult<Cart>> {
  try {
    const { data } = await apiClient.get<Cart>('/me/cart/');
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/** POST /me/cart/items/ */
export async function addCartItem(
  payload: AddCartItemPayload,
): Promise<ApiResult<Cart>> {
  try {
    const { data } = await apiClient.post<Cart>('/me/cart/items/', payload);
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}

/**
 * POST /me/checkout/
 * Backend may return either Order[] or Paginated<Order> — normalize to array.
 */
export async function checkout(
  payload: CheckoutPayload,
): Promise<ApiResult<Order[]>> {
  try {
    const { data } = await apiClient.post<Order[] | Paginated<Order>>('/me/checkout/', payload);
    const orders = Array.isArray(data) ? data : data.results;
    return {
      ok: true,
      data: orders,
      meta: { fetchedAt: new Date().toISOString(), source: 'api' },
    };
  } catch (error) {
    return toFailure(error);
  }
}

/** GET /me/orders/ */
export async function fetchOrders(
  params: OrderListParams = {},
): Promise<ApiResult<Paginated<Order>>> {
  try {
    const { data } = await apiClient.get<Paginated<Order>>('/me/orders/', { params });
    return { ok: true, data, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
  } catch (error) {
    return toFailure(error);
  }
}
