import { Image } from 'expo-image';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { ServiceListItem } from '@/types/service';
import { formatMoney, formatRating } from '@/utils/format';

type ServiceCardProps = {
  item: ServiceListItem;
  onPress: () => void;
};

function priceLabel(item: ServiceListItem): string {
  if (item.price_type === 'from' || (!item.price_max && item.price_min)) {
    return `от ${formatMoney(item.price_min)}`;
  }
  if (item.price_min && item.price_max) {
    return `${formatMoney(item.price_min)} – ${formatMoney(item.price_max)}`;
  }
  return formatMoney(item.price_min);
}

function ServiceCardComponent({ item, onPress }: ServiceCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(item.cover) && !imageFailed;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <View style={styles.imageWrap}>
        {showImage ? (
          <Image
            source={{ uri: item.cover! }}
            style={styles.image}
            contentFit="cover"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Нет фото</Text>
          </View>
        )}
      </View>
      <View style={styles.body}>
        <Text style={styles.category}>{item.category.name}</Text>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.price}>{priceLabel(item)}</Text>
        <Text style={styles.meta} numberOfLines={1}>
          {item.provider.display_name} · {formatRating(item.rating, item.rating_count)}
        </Text>
      </View>
    </Pressable>
  );
}

export const ServiceCard = memo(ServiceCardComponent);

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
