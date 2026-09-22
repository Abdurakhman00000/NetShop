import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ProductCard } from '@/components/catalog/ProductCard';
import { ServiceCard } from '@/components/catalog/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { SearchField } from '@/components/ui/SearchField';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { fetchProducts } from '@/services/api/products';
import { fetchServices } from '@/services/api/services';
import type { ProductListItem } from '@/types/product';
import type { ServiceListItem } from '@/types/service';

type CombinedItem =
  | { kind: 'product'; data: ProductListItem }
  | { kind: 'service'; data: ServiceListItem };

export default function GlobalSearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 350);

  const [products, setProducts] = useState<ProductListItem[]>([]);
  const [services, setServices] = useState<ServiceListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError(null);

      const search = debouncedQuery || undefined;
      const [productsResult, servicesResult] = await Promise.all([
        fetchProducts({ search, page_size: 40 }),
        fetchServices({ search, page_size: 40 }),
      ]);

      if (cancelled) return;

      if (!productsResult.ok && !servicesResult.ok) {
        setError(productsResult.error.message || servicesResult.error.message);
        setProducts([]);
        setServices([]);
      } else {
        setProducts(productsResult.ok ? productsResult.data.results : []);
        setServices(servicesResult.ok ? servicesResult.data.results : []);
        if (!productsResult.ok || !servicesResult.ok) {
          setError('Часть результатов не загрузилась');
        }
      }
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const items = useMemo<CombinedItem[]>(
    () => [
      ...products.map((data) => ({ kind: 'product' as const, data })),
      ...services.map((data) => ({ kind: 'service' as const, data })),
    ],
    [products, services],
  );

  const openProduct = useCallback((id: string) => {
    router.push(`/product/${id}` as Href);
  }, []);

  const openService = useCallback((id: string) => {
    router.push(`/service/${id}` as Href);
  }, []);

  const isSearching = debouncedQuery.length > 0;
  const total = products.length + services.length;

  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={styles.topRow}>
        <Pressable
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Назад"
          style={styles.back}
        >
          <Text style={styles.backText}>Отмена</Text>
        </Pressable>
        <View style={styles.searchFlex}>
          <SearchField
            value={query}
            onChangeText={setQuery}
            placeholder="Поиск товаров и услуг"
            autoFocus
            flush
            onSubmit={() => setQuery((q) => q.trim())}
          />
        </View>
      </View>

      {loading && items.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.brand} size="large" />
        </View>
      ) : error && items.length === 0 ? (
        <EmptyState title="Ошибка загрузки" subtitle={error} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => `${item.kind}-${item.data.id}`}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={[
            styles.list,
            { paddingBottom: insets.bottom + Spacing.xxxl },
          ]}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={
            <Text style={styles.count}>
              {isSearching ? `Найдено: ${total}` : `${total} позиций`}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              title="Ничего не найдено"
              subtitle={
                isSearching ? 'Попробуйте другой запрос' : 'Пока нет товаров и услуг'
              }
            />
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              {item.kind === 'product' ? (
                <ProductCard item={item.data} onPress={() => openProduct(item.data.id)} />
              ) : (
                <ServiceCard item={item.data} onPress={() => openService(item.data.id)} />
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  back: { paddingVertical: Spacing.sm },
  backText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.md,
    color: Colors.brand,
  },
  searchFlex: { flex: 1 },
  list: { paddingHorizontal: Spacing.lg, gap: Spacing.md },
  row: { gap: Spacing.md },
  cardWrap: { flex: 1 },
  count: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
