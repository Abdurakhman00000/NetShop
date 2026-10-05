import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SearchField } from '@/components/ui/SearchField';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import { selectCartCount } from '@/store/cartSlice';
import { useAppSelector } from '@/store/hooks';

type CatalogHeaderProps = {
  query: string;
  onChangeQuery: (text: string) => void;
  onSubmit?: () => void;
  cityName?: string;
  title?: string;
  placeholder?: string;
};

function CatalogHeaderComponent({
  query,
  onChangeQuery,
  onSubmit,
  cityName,
  title = 'Каталог',
  placeholder,
}: CatalogHeaderProps) {
  const insets = useSafeAreaInsets();
  const cartCount = useAppSelector((s) => selectCartCount(s.cart.cart));

  const openCart = useCallback(() => {
    router.push('/(tabs)/cart' as Href);
  }, []);

  return (
    <View style={[styles.wrap, { paddingTop: insets.top + Spacing.sm }]}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.city}>
          <Ionicons name="location-outline" size={14} color={Colors.textOnDarkMuted} />
          <Text style={styles.cityText} numberOfLines={1}>
            {cityName ?? 'Все города'}
          </Text>
        </View>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchCell}>
          <SearchField
            value={query}
            onChangeText={onChangeQuery}
            onSubmit={onSubmit}
            placeholder={
              placeholder ?? (cityName ? `Поиск в ${cityName}` : 'Поиск по каталогу')
            }
            tone="onDark"
            flush
          />
        </View>
        <Pressable
          onPress={openCart}
          style={({ pressed }) => [styles.cart, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={cartCount > 0 ? `Корзина, ${cartCount} товаров` : 'Корзина'}
        >
          <Ionicons name="cart-outline" size={26} color={Colors.ink} />
          {cartCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
            </View>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}

export const CatalogHeader = memo(CatalogHeaderComponent);

const CART_SIZE = 52;

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.ink,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomLeftRadius: Radii.xxl,
    borderBottomRightRadius: Radii.xxl,
    gap: Spacing.lg,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: FontSize.xxl,
    color: Colors.textOnDark,
  },
  city: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 1,
    marginBottom: 4,
  },
  cityText: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.sm,
    color: Colors.textOnDarkMuted,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  searchCell: {
    flex: 1,
  },
  cart: {
    width: CART_SIZE,
    height: CART_SIZE,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 5,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: Radii.pill,
    backgroundColor: Colors.notification,
    borderWidth: 2,
    borderColor: Colors.surfaceElevated,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontFamily: 'DMSans_700Bold',
    fontSize: 10,
    color: Colors.textOnDark,
  },
});
