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
import { CategoryTiles } from '@/components/catalog/CategoryTiles';
import { ServiceCard } from '@/components/catalog/ServiceCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ServiceCategoryImages } from '@/constants/images';
import { Colors, FontSize, Spacing } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useServiceList } from '@/hooks/useServiceList';
import { pluralRu } from '@/utils/format';

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

  const selected = categories.find((c) => c.id === categoryId);
  const sectionTitle = isSearching ? 'Результаты поиска' : (selected?.name ?? 'Все услуги');
  const countLabel = isSearching
    ? `Найдено: ${count}`
    : `${count} ${pluralRu(count, ['услуга', 'услуги', 'услуг'])}`;

  const listHeader = (
    <View style={styles.header}>
      {!isSearching ? (
        <CategoryTiles
          categories={categories}
          selectedId={categoryId}
          onSelect={setCategoryId}
          images={ServiceCategoryImages}
        />
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
        title="Услуги"
        query={query}
        onChangeQuery={setQuery}
        onSubmit={() => setQuery((q) => q.trim())}
        placeholder="Поиск по всем услугам"
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
        onEndReachedThreshold={0.35}
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
                isSearching ? 'Попробуйте другой запрос' : 'Попробуйте другую категорию'
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
            <ServiceCard item={item} onPress={() => openService(item.id)} />
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
