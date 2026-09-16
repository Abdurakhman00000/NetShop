import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AuthButton } from '@/components/auth/AuthButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import { fetchMyStore, fetchSellerProducts } from '@/services/api/seller';
import { useAppSelector } from '@/store/hooks';
import type { SellerProduct, Store } from '@/types/seller';
import { formatMoney } from '@/utils/format';

const STATUS_RU: Record<string, string> = {
  draft: 'Черновик',
  published: 'Опубликован',
  hidden: 'Скрыт',
  archived: 'Архив',
};

export default function SellerHomeScreen() {
  const authStatus = useAppSelector((s) => s.auth.status);
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<SellerProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noStore, setNoStore] = useState(false);

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    if (mode === 'initial') setLoading(true);
    if (mode === 'refresh') setRefreshing(true);
    setError(null);

    const storeResult = await fetchMyStore();
    if (!storeResult.ok) {
      if (storeResult.error.status === 404) {
        setNoStore(true);
        setStore(null);
        setProducts([]);
      } else {
        setError(storeResult.error.message);
      }
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setNoStore(false);
    setStore(storeResult.data);

    const productsResult = await fetchSellerProducts({ page_size: 50 });
    if (productsResult.ok) {
      setProducts(productsResult.data.results);
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    if (authStatus === 'anonymous') {
      router.replace('/(auth)/login' as Href);
      return;
    }
    void load('initial');
  }, [authStatus, load]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.brand} size="large" />
      </View>
    );
  }

  if (noStore) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Мой магазин" showBack />
        <EmptyState
          title="Магазина ещё нет"
          subtitle="Создайте магазин, чтобы публиковать товары"
          actionLabel="Создать магазин"
          onAction={() => router.push('/seller/create' as Href)}
        />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title="Мой магазин" showBack />
      {error ? (
        <EmptyState title="Ошибка" subtitle={error} actionLabel="Повторить" onAction={() => load('refresh')} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load('refresh')}
              tintColor={Colors.brand}
            />
          }
          ListHeaderComponent={
            store ? (
              <View style={styles.storeCard}>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeMeta}>
                  {store.city} · {store.status}
                </Text>
                {store.description ? (
                  <Text style={styles.storeDesc} numberOfLines={3}>
                    {store.description}
                  </Text>
                ) : null}
                <AuthButton
                  label="Добавить товар"
                  onPress={() => router.push('/seller/product-new' as Href)}
                  style={{ marginTop: Spacing.md }}
                />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <EmptyState
              title="Товаров пока нет"
              subtitle="Создайте первый товар — он появится как черновик"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productTop}>
                <Text style={styles.productTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.productStatus}>
                  {STATUS_RU[item.status] ?? item.status}
                </Text>
              </View>
              <Text style={styles.productPrice}>{formatMoney(item.price)}</Text>
              <Text style={styles.productMeta}>
                {item.category.name} · остаток {item.stock_qty}
              </Text>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, paddingBottom: Spacing.xxxl, gap: Spacing.md },
  storeCard: {
    backgroundColor: Colors.brandSoft,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  storeName: { fontFamily: 'PlayfairDisplay_700Bold', fontSize: FontSize.xl, color: Colors.text },
  storeMeta: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 4 },
  storeDesc: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.text, marginTop: Spacing.sm },
  productCard: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
    gap: 4,
  },
  productTop: { flexDirection: 'row', justifyContent: 'space-between', gap: Spacing.sm },
  productTitle: { flex: 1, fontFamily: 'DMSans_700Bold', fontSize: FontSize.md, color: Colors.text },
  productStatus: { fontFamily: 'DMSans_500Medium', fontSize: FontSize.xs, color: Colors.brand },
  productPrice: { fontFamily: 'DMSans_700Bold', fontSize: FontSize.lg, color: Colors.brand },
  productMeta: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
});
