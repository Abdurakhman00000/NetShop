import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchProducts } from '@/services/api/products';
import type { ProductListItem, ProductListParams } from '@/types/product';

export function useProductList(filters: Omit<ProductListParams, 'page'>) {
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pageRef = useRef(1);
  const filterKey = JSON.stringify(filters);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode === 'more') setLoadingMore(true);
      if (mode !== 'more') setError(null);

      const page = mode === 'more' ? pageRef.current + 1 : 1;

      const result = await fetchProducts({
        ...filters,
        page,
        page_size: filters.page_size ?? 20,
      });

      if (!result.ok) {
        setError(result.error.message);
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
        return;
      }

      pageRef.current = page;
      setCount(result.data.count);
      setHasMore(Boolean(result.data.next));
      setItems((prev) =>
        mode === 'more' ? [...prev, ...result.data.results] : result.data.results,
      );
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterKey],
  );

  useEffect(() => {
    pageRef.current = 1;
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
      if (!loadingMore && hasMore) void load('more');
    },
  };
}
