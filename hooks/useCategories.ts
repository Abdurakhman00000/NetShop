import { useCallback, useEffect, useState } from 'react';

import { fetchCategories } from '@/services/api/catalog';
import type { Category, CategoryKind } from '@/types/common';

export function useCategories(kind: CategoryKind) {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await fetchCategories(kind);
    if (!result.ok) {
      setError(result.error.message);
      setData([]);
    } else {
      setData(result.data);
    }
    setLoading(false);
  }, [kind]);

  useEffect(() => {
    void load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
