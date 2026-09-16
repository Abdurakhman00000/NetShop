import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useCallback, useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthButton } from '@/components/auth/AuthButton';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import { loadCart, selectCartCount } from '@/store/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { CartItem } from '@/types/commerce';
import { formatMoney } from '@/utils/format';

function CartRow({ item }: { item: CartItem }) {
  return (
    <View style={[styles.row, !item.available && styles.unavailable]}>
      <View style={styles.thumb}>
        {item.cover ? (
          <Image source={{ uri: item.cover }} style={styles.thumbImage} contentFit="cover" />
        ) : (
          <View style={styles.thumbPlaceholder} />
        )}
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.rowMeta}>{item.store}</Text>
        <Text style={styles.rowPrice}>
          {formatMoney(item.price)} × {item.qty} = {formatMoney(item.line_total)}
        </Text>
        {!item.available ? (
          <Text style={styles.warn}>Недоступен к покупке</Text>
        ) : null}
      </View>
    </View>
  );
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector((s) => s.auth.status);
  const { cart, loading, error } = useAppSelector((s) => s.cart);
  const count = selectCartCount(cart);

  useEffect(() => {
    if (authStatus === 'authenticated') {
      void dispatch(loadCart());
    }
  }, [authStatus, dispatch]);

  const onRefresh = useCallback(() => {
    void dispatch(loadCart());
  }, [dispatch]);

  if (authStatus !== 'authenticated') {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Корзина" />
        <EmptyState
          title="Войдите, чтобы видеть корзину"
          subtitle="Добавлять товары можно после входа в аккаунт"
          actionLabel="Войти"
          onAction={() => router.push('/(auth)/login' as Href)}
        />
      </View>
    );
  }

  if (loading && !cart) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color={Colors.brand} size="large" />
      </View>
    );
  }

  const items = cart?.items ?? [];

  return (
    <View style={styles.root}>
      <ScreenHeader title="Корзина" subtitle={count ? `${count} шт.` : undefined} />
      {error && items.length === 0 ? (
        <EmptyState title="Ошибка" subtitle={error} actionLabel="Повторить" onAction={onRefresh} />
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.product_id}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={onRefresh}
                tintColor={Colors.brand}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title="Корзина пуста"
                subtitle="Добавьте товары из каталога"
                actionLabel="В каталог"
                onAction={() => router.push('/(tabs)/catalog' as Href)}
              />
            }
            renderItem={({ item }) => <CartRow item={item} />}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
          />
          {items.length > 0 ? (
            <View style={[styles.footer, { paddingBottom: insets.bottom + Spacing.md }]}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Итого</Text>
                <Text style={styles.totalValue}>{formatMoney(cart?.total)}</Text>
              </View>
              <AuthButton
                label="Оформить заказ"
                onPress={() => router.push('/checkout' as Href)}
              />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: Spacing.lg, paddingBottom: 140 },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  unavailable: { opacity: 0.65 },
  thumb: {
    width: 72,
    height: 72,
    borderRadius: Radii.sm,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  thumbImage: { width: '100%', height: '100%' },
  thumbPlaceholder: { flex: 1, backgroundColor: Colors.brandSoft },
  rowBody: { flex: 1, gap: 4 },
  rowTitle: { fontFamily: 'DMSans_500Medium', fontSize: FontSize.md, color: Colors.text },
  rowMeta: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.xs, color: Colors.textMuted },
  rowPrice: { fontFamily: 'DMSans_700Bold', fontSize: FontSize.sm, color: Colors.brand },
  warn: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.xs, color: Colors.error },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.md,
  },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontFamily: 'DMSans_500Medium', fontSize: FontSize.md, color: Colors.textSecondary },
  totalValue: { fontFamily: 'DMSans_700Bold', fontSize: FontSize.xl, color: Colors.text },
});
