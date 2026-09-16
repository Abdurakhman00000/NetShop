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

import { CategoryChips } from '@/components/catalog/CategoryChips';
import { ProductCard } from '@/components/catalog/ProductCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useProductList } from '@/hooks/useProductList';
import { useAppSelector } from '@/store/hooks';

export default function CatalogScreen() {
  const selectedCity = useAppSelector((s) => s.city.selected);
  const { data: categories } = useCategories('product');

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');

  const filters = useMemo(
    () => ({
      category: categoryId ?? undefined,
      city: selectedCity?.id,
      search: search || undefined,
      page_size: 20,
    }),
    [categoryId, selectedCity?.id, search],
  );

  const { items, count, loading, refreshing, loadingMore, error, refetch, loadMore } =
    useProductList(filters);

  const openProduct = useCallback((id: string) => {
    router.push(`/product/${id}` as Href);
  }, []);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Каталог"
        subtitle={selectedCity ? selectedCity.name : 'Все города'}
      />
      <View style={styles.searchWrap}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Поиск товаров"
          onSubmit={() => setSearch(query.trim())}
        />
      </View>
      <View style={styles.chips}>
        <CategoryChips
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
      </View>

      {loading && items.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.brand} size="large" />
        </View>
      ) : error && items.length === 0 ? (
        <EmptyState title="Не удалось загрузить" subtitle={error} actionLabel="Повторить" onAction={refetch} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetch} tintColor={Colors.brand} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <Text style={styles.count}>{count} товаров</Text>
          }
          ListEmptyComponent={
            <EmptyState
              title="Ничего не найдено"
              subtitle="Попробуйте другую категорию или запрос"
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={Colors.brand} style={{ marginVertical: Spacing.lg }} />
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <ProductCard item={item} onPress={() => openProduct(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { marginTop: Spacing.md },
  chips: { marginTop: Spacing.md, marginBottom: Spacing.sm },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.md },
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
