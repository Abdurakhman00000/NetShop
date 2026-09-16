import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import { fetchOrders } from '@/services/api/commerce';
import { useAppSelector } from '@/store/hooks';
import type { Order, OrderStatus } from '@/types/commerce';
import { formatMoney } from '@/utils/format';
import { router, type Href } from 'expo-router';

const STATUS_LABEL: Record<string, string> = {
  new: 'Новый',
  confirmed: 'Подтверждён',
  completed: 'Завершён',
  cancelled: 'Отменён',
};

const FILTERS: Array<{ id: OrderStatus | null; label: string }> = [
  { id: null, label: 'Все' },
  { id: 'new', label: 'Новые' },
  { id: 'confirmed', label: 'В работе' },
  { id: 'completed', label: 'Готовые' },
  { id: 'cancelled', label: 'Отмена' },
];

function OrderCard({ order }: { order: Order }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.store}>{order.store.name}</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{STATUS_LABEL[order.status] ?? order.status}</Text>
        </View>
      </View>
      <Text style={styles.total}>{formatMoney(order.total)}</Text>
      <Text style={styles.meta}>
        {order.city}, {order.address}
      </Text>
      <Text style={styles.meta}>
        {order.items.length} поз. · {new Date(order.created_at).toLocaleString('ru-RU')}
      </Text>
      {order.items.slice(0, 3).map((item) => (
        <Text key={`${order.id}-${item.product_id}`} style={styles.itemLine} numberOfLines={1}>
          {item.title} × {item.qty}
        </Text>
      ))}
    </View>
  );
}

export default function OrdersScreen() {
  const authStatus = useAppSelector((s) => s.auth.status);
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (mode === 'initial') setLoading(true);
      if (mode === 'refresh') setRefreshing(true);
      setError(null);
      const result = await fetchOrders({
        status: status ?? undefined,
        page_size: 50,
      });
      if (!result.ok) {
        setError(result.error.message);
        setOrders([]);
      } else {
        setOrders(result.data.results);
      }
      setLoading(false);
      setRefreshing(false);
    },
    [status],
  );

  useEffect(() => {
    if (authStatus === 'anonymous') {
      router.replace('/(auth)/login' as Href);
      return;
    }
    void load('initial');
  }, [authStatus, load]);

  return (
    <View style={styles.root}>
      <ScreenHeader title="Мои заказы" showBack />
      <View style={styles.filters}>
        {FILTERS.map((f) => {
          const active = status === f.id;
          return (
            <Pressable
              key={f.label}
              onPress={() => setStatus(f.id)}
              style={[styles.filterChip, active && styles.filterActive]}
            >
              <Text style={[styles.filterText, active && styles.filterTextActive]}>{f.label}</Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.brand} size="large" />
        </View>
      ) : error ? (
        <EmptyState title="Ошибка" subtitle={error} actionLabel="Повторить" onAction={() => load('refresh')} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load('refresh')}
              tintColor={Colors.brand}
            />
          }
          ListEmptyComponent={
            <EmptyState title="Заказов пока нет" subtitle="Оформите покупку из корзины" />
          }
          renderItem={({ item }) => <OrderCard order={item} />}
          ItemSeparatorComponent={() => <View style={{ height: Spacing.md }} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  filterActive: { backgroundColor: Colors.brand, borderColor: Colors.brand },
  filterText: { fontFamily: 'DMSans_500Medium', fontSize: FontSize.sm, color: Colors.textSecondary },
  filterTextActive: { color: Colors.textOnDark },
  list: { padding: Spacing.lg, paddingBottom: Spacing.xxxl },
  card: {
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  store: { fontFamily: 'DMSans_700Bold', fontSize: FontSize.md, color: Colors.text, flex: 1 },
  statusPill: {
    backgroundColor: Colors.brandSoft,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  statusText: { fontFamily: 'DMSans_500Medium', fontSize: FontSize.xs, color: Colors.brand },
  total: { fontFamily: 'DMSans_700Bold', fontSize: FontSize.lg, color: Colors.brand },
  meta: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.textSecondary },
  itemLine: { fontFamily: 'DMSans_400Regular', fontSize: FontSize.sm, color: Colors.text },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
