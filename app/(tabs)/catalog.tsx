import { router, type Href } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { CatalogHeader } from '@/components/catalog/CatalogHeader';
import { CategoryChips } from '@/components/catalog/CategoryChips';
import { CategoryTiles } from '@/components/catalog/CategoryTiles';
import { ProductCard } from '@/components/catalog/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useProductList, type ProductListFilters } from '@/hooks/useProductList';
import { useAppSelector } from '@/store/hooks';
import { pluralRu } from '@/utils/format';

export default function CatalogScreen() {
  const selectedCity = useAppSelector((s) => s.city.selected);
  const { data: categories } = useCategories('product');

  const [parentId, setParentId] = useState<string | null>(null);
  const [childId, setChildId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 350);
  const isSearching = debouncedQuery.length > 0;

  const parent = useMemo(
    () => categories.find((c) => c.id === parentId) ?? null,
    [categories, parentId],
  );

  const selectParent = useCallback((id: string | null) => {
    setParentId(id);
    setChildId(null);
  }, []);

  const filters = useMemo<ProductListFilters>(() => {
    const base = { city: selectedCity?.id, page_size: 40 };
    // While searching — whole catalog; category filter would hide matches.
    if (isSearching) return { ...base, search: debouncedQuery };
    if (childId) return { ...base, category: childId };
    if (parent) {
      return parent.children.length
        ? { ...base, categories: parent.children.map((c) => c.id) }
        : { ...base, category: parent.id };
    }
    return base;
  }, [selectedCity?.id, isSearching, debouncedQuery, childId, parent]);

  const { items, count, loading, refreshing, loadingMore, error, refetch, loadMore } =
    useProductList(filters);

  const openProduct = useCallback((id: string) => {
    router.push(`/product/${id}` as Href);
  }, []);

  const sectionTitle = isSearching ? 'Результаты поиска' : (parent?.name ?? 'Все товары');
  const countLabel = isSearching
    ? `Найдено: ${count}`
    : `${count} ${pluralRu(count, ['товар', 'товара', 'товаров'])}`;

  const listHeader = (
    <View style={styles.header}>
      {!isSearching ? (
        <>
          <CategoryTiles
            categories={categories}
            selectedId={parentId}
            onSelect={selectParent}
          />
          {parent && parent.children.length > 0 ? (
            <View style={styles.subChips}>
              <CategoryChips
                categories={parent.children}
                selectedId={childId}
                onSelect={setChildId}
                flattenChildren={false}
                allLabel={`Все: ${parent.name}`}
                tone="dark"
              />
            </View>
          ) : null}
        </>
      ) : null}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle} numberOfLines={1}>
          {sectionTitle}
        </Text>
        {!loading ? <Text style={styles.count}>{countLabel}</Text> : null}
      </View>
    </View>
  );

  return (
    <View style={styles.root}>
      <CatalogHeader
        query={query}
        onChangeQuery={setQuery}
        onSubmit={() => setQuery((q) => q.trim())}
        cityName={selectedCity?.name}
      />

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor={Colors.ink}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={
          loading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={Colors.ink} size="large" />
            </View>
          ) : error ? (
            <EmptyState
              title="Не удалось загрузить"
              subtitle={error}
              actionLabel="Повторить"
              onAction={refetch}
            />
          ) : (
            <EmptyState
              title="Ничего не найдено"
              subtitle={
                isSearching
                  ? 'Попробуйте другой запрос'
                  : 'Попробуйте другую категорию или запрос'
              }
            />
          )
        }
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator color={Colors.ink} style={{ marginVertical: Spacing.lg }} />
          ) : null
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrap}>
            <ProductCard item={item} onPress={() => openProduct(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    marginHorizontal: -Spacing.lg,
    paddingTop: Spacing.lg,
    gap: Spacing.md,
  },
  subChips: { marginTop: Spacing.xs },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    flex: 1,
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.lg,
    color: Colors.ink,
  },
  count: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  row: { gap: Spacing.md },
  cardWrap: { flex: 1 },
  centered: { paddingVertical: Spacing.xxxl, alignItems: 'center', justifyContent: 'center' },
});
