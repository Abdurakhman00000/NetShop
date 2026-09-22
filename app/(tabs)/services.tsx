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
import { ServiceCard } from '@/components/catalog/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { SearchField } from '@/components/ui/SearchField';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useServiceList } from '@/hooks/useServiceList';

export default function ServicesScreen() {
  const { data: categories } = useCategories('service');

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query.trim(), 350);
  const isSearching = debouncedQuery.length > 0;

  const filters = useMemo(
    () => ({
      category: isSearching ? undefined : categoryId ?? undefined,
      search: isSearching ? debouncedQuery : undefined,
      page_size: 40,
    }),
    [categoryId, debouncedQuery, isSearching],
  );

  const { items, count, loading, refreshing, loadingMore, error, refetch, loadMore } =
    useServiceList(filters);

  const openService = useCallback((id: string) => {
    router.push(`/service/${id}` as Href);
  }, []);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Услуги" subtitle="Все города" />
      <View style={styles.searchWrap}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Поиск по всем услугам"
          onSubmit={() => setQuery((q) => q.trim())}
        />
      </View>
      {!isSearching ? (
        <View style={styles.chips}>
          <CategoryChips
            categories={categories}
            selectedId={categoryId}
            onSelect={setCategoryId}
            flattenChildren={false}
          />
        </View>
      ) : null}

      {loading && items.length === 0 ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.brand} size="large" />
        </View>
      ) : error && items.length === 0 ? (
        <EmptyState
          title="Не удалось загрузить"
          subtitle={error}
          actionLabel="Повторить"
          onAction={refetch}
        />
      ) : (
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
              tintColor={Colors.brand}
            />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.35}
          ListHeaderComponent={
            <Text style={styles.count}>
              {isSearching ? `Найдено: ${count}` : `${count} услуг`}
            </Text>
          }
          ListEmptyComponent={
            <EmptyState
              title="Ничего не найдено"
              subtitle={
                isSearching ? 'Попробуйте другой запрос' : 'Попробуйте другую категорию'
              }
            />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                color={Colors.brand}
                style={{ marginVertical: Spacing.lg }}
              />
            ) : null
          }
          renderItem={({ item }) => (
            <View style={styles.cardWrap}>
              <ServiceCard item={item} onPress={() => openService(item.id)} />
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
  list: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
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
