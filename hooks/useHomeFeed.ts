import { useCallback, useEffect, useState } from 'react';

import { fetchHomeFeed } from '@/services/api/home';
import type { HomeFeed } from '@/types/home';

type HomeFeedState = {
  data: HomeFeed | null;
  loading: boolean;
  error: string | null;
  refreshing: boolean;
  refetch: () => Promise<void>;
};

/**
 * Screen-level data hook. Ready to swap internals for RTK Query later
 * without changing Home UI components.
 */
export function useHomeFeed(): HomeFeedState {
  const [data, setData] = useState<HomeFeed | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    if (mode === 'initial') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    setError(null);

    try {
      const result = await fetchHomeFeed();
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      setData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось загрузить данные');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load('initial');
  }, [load]);

  return {
    data,
    loading,
    error,
    refreshing,
    refetch: () => load('refresh'),
  };
}
