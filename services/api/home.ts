import { mockHomeFeed } from '@/services/mock/home';
import type { ApiResult, HomeFeed } from '@/types/home';

/**
 * Toggle when real backend is connected.
 * Keep mock path for Storybook / offline / CI.
 */
const USE_MOCK = true;

/**
 * Home feed service — API-shaped contract.
 * Later: GET /v1/home via apiClient, map DTO → HomeFeed.
 */
export async function fetchHomeFeed(): Promise<ApiResult<HomeFeed>> {
  if (USE_MOCK) {
    // Simulate network latency so UI loading states stay realistic
    await new Promise((resolve) => setTimeout(resolve, 280));
    return {
      ok: true,
      data: mockHomeFeed,
      meta: {
        fetchedAt: new Date().toISOString(),
        source: 'mock',
      },
    };
  }

  // Placeholder for real integration:
  // const { data } = await apiClient.get<HomeFeedDto>('/v1/home');
  // return { ok: true, data: mapHomeFeed(data), meta: { fetchedAt: ..., source: 'api' } };

  return {
    ok: false,
    error: {
      code: 'NOT_IMPLEMENTED',
      message: 'API home feed is not connected yet',
    },
  };
}
