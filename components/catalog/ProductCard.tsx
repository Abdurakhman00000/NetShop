import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { ProductListItem } from '@/types/product';
import { formatMoney, formatRating } from '@/utils/format';

type ProductCardProps = {
  item: ProductListItem;
  onPress: () => void;
};

function ProductCardComponent({ item, onPress }: ProductCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <View style={styles.imageWrap}>
        {item.cover ? (
          <Image source={{ uri: item.cover }} style={styles.image} contentFit="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Нет фото</Text>
          </View>
        )}
        {!item.in_stock ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Нет в наличии</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.body}>
        <Text style={styles.category}>{item.category.name}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>{formatMoney(item.price)}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.store.name} · {formatRating(item.rating, item.rating_count)}
        </Text>
      </View>
    </Pressable>
  );
}

export const ProductCard = memo(ProductCardComponent);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.border,
  },
  pressed: {
    opacity: 0.92,
  },
  imageWrap: {
    aspectRatio: 1,
    backgroundColor: Colors.surface,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.brandSoft,
  },
  placeholderText: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  badge: {
    position: 'absolute',
    left: Spacing.sm,
    bottom: Spacing.sm,
    backgroundColor: Colors.overlayStrong,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radii.sm,
  },
  badgeText: {
    color: Colors.textOnDark,
    fontSize: FontSize.xs,
    fontFamily: 'DMSans_500Medium',
  },
  body: {
    padding: Spacing.md,
    gap: 4,
  },
  category: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  title: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.sm,
    color: Colors.text,
    minHeight: 36,
  },
  price: {
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.md,
    color: Colors.brand,
    marginTop: 2,
  },
  meta: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
});
