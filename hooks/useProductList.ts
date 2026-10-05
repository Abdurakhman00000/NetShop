import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchProducts } from '@/services/api/products';
import type { ApiResult } from '@/types/home';
import type { ProductListItem, ProductListParams } from '@/types/product';

export type ProductListFilters = Omit<ProductListParams, 'page'> & {
  /**
   * Fetch several categories at once and merge them. The API has no
   * parent-category filter, so a parent is expanded into its children.
   */
  categories?: string[];
};

type PageResult = {
  count: number;
  results: ProductListItem[];
  /** Categories (or `null` for a plain query) that still have a next page. */
  pending: (string | null)[];
};

async function fetchPage(
  params: Omit<ProductListParams, 'page'>,
  targets: (string | null)[],
  page: number,
): Promise<ApiResult<PageResult>> {
  const responses = await Promise.all(
    targets.map((category) =>
      fetchProducts({ ...params, ...(category ? { category } : null), page }),
    ),
  );

  const merged: PageResult = { count: 0, results: [], pending: [] };
  for (let i = 0; i < responses.length; i += 1) {
    const res = responses[i];
    if (!res.ok) return res;
    merged.count += res.data.count;
    merged.results.push(...res.data.results);
    if (res.data.next) merged.pending.push(targets[i]);
  }
  return { ok: true, data: merged, meta: { fetchedAt: new Date().toISOString(), source: 'api' } };
}

export function useProductList(filters: ProductListFilters) {
  const [items, setItems] = useState<ProductListItem[]>([]);
  const [count, setCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pageRef = useRef(1);
  const pendingRef = useRef<(string | null)[]>([]);
  const loadingMoreRef = useRef(false);
  const filterKey = JSON.stringify(filters);

  const load = useCallback(
    async (mode: 'initial' | 'refresh' | 'more') => {
      if (mode === 'more') {
        if (loadingMoreRef.current || pendingRef.current.length === 0) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      }
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      if (mode !== 'more') setError(null);

      const { categories, ...params } = filters;
      const page = mode === 'more' ? pageRef.current + 1 : 1;
      const targets =
        mode === 'more'
          ? pendingRef.current
          : categories?.length
            ? categories
            : [params.category ?? null];

      const result = await fetchPage(
        { ...params, page_size: params.page_size ?? 40 },
        targets,
        page,
      );

      if (!result.ok) {
        setError(result.error.message);
        setLoading(false);
        setRefreshing(false);
        loadingMoreRef.current = false;
        setLoadingMore(false);
        return;
      }

      pageRef.current = page;
      pendingRef.current = result.data.pending;
      setHasMore(result.data.pending.length > 0);
      if (mode !== 'more') setCount(result.data.count);
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
    pendingRef.current = [];
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
