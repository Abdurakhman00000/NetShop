import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchServices } from '@/services/api/services';
import type { ServiceListItem, ServiceListParams } from '@/types/service';

export function useServiceList(filters: Omit<ServiceListParams, 'page'>) {
  const [items, setItems] = useState<ServiceListItem[]>([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageRef = useRef(1);
  const hasMoreRef = useRef(false);
  const loadingMoreRef = useRef(false);
  const filterKey = JSON.stringify(filters);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'more') {
        if (loadingMoreRef.current || !hasMoreRef.current) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode !== 'more') setError(null);

      const page = mode === 'more' ? pageRef.current + 1 : 1;

      const result = await fetchServices({
        ...filters,
        page,
        page_size: filters.page_size ?? 40,
      });

      if (!result.ok) {
        setError(result.error.message);
        setLoading(false);
        setRefreshing(false);
        loadingMoreRef.current = false;
        setLoadingMore(false);
        return;
      }

      pageRef.current = page;
      const nextHasMore = Boolean(result.data.next);
      hasMoreRef.current = nextHasMore;
      setHasMore(nextHasMore);
      setCount(result.data.count);
      setItems((prev) =>
        mode === 'more' ? [...prev, ...result.data.results] : result.data.results,
      );
      setLoading(false);
      setRefreshing(false);
      loadingMoreRef.current = false;
      setLoadingMore(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterKey],
  );

  useEffect(() => {
    pageRef.current = 1;
    hasMoreRef.current = false;
    void load('initial');
  }, [load]);

  return {
    items,
    count,
    hasMore,
    loading,
    refreshing,
    loadingMore,
    error,
    refetch: () => load('refresh'),
    loadMore: () => {
      void load('more');
    },
  };
}
