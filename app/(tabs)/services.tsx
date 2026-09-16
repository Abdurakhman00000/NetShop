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
import { useServiceList } from '@/hooks/useServiceList';
import { useAppSelector } from '@/store/hooks';

export default function ServicesScreen() {
  const selectedCity = useAppSelector((s) => s.city.selected);
  const { data: categories } = useCategories('service');

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
    useServiceList(filters);

  const openService = useCallback((id: string) => {
    router.push(`/service/${id}` as Href);
  }, []);

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Услуги"
        subtitle={selectedCity ? selectedCity.name : 'Все города'}
      />
      <View style={styles.searchWrap}>
        <SearchField
          value={query}
          onChangeText={setQuery}
          placeholder="Поиск услуг"
          onSubmit={() => setSearch(query.trim())}
        />
      </View>
      <View style={styles.chips}>
        <CategoryChips
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
          flattenChildren={false}
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
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={refetch} tintColor={Colors.brand} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <Text style={styles.count}>{count} услуг</Text>
          }
          ListEmptyComponent={
            <EmptyState title="Ничего не найдено" subtitle="Попробуйте другую категорию" />
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={Colors.brand} style={{ marginVertical: Spacing.lg }} />
            ) : null
          }
          renderItem={({ item }) => (
            <ServiceCard item={item} onPress={() => openService(item.id)} />
          )}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  searchWrap: { marginTop: Spacing.md },
  chips: { marginTop: Spacing.md, marginBottom: Spacing.sm },
  list: { paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xxxl },
  count: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
