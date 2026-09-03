import { Image } from 'expo-image';
import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowCircleButton, IconCircle } from '@/components/ui/IconCircle';
import { Badge } from '@/components/ui/Badge';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { EcosystemDirection } from '@/types/home';

type EcosystemCardProps = {
  item: EcosystemDirection;
  onPress?: (item: EcosystemDirection) => void;
};

function EcosystemCardComponent({ item, onPress }: EcosystemCardProps) {
  const featured = item.size === 'featured';

  const handlePress = useCallback(() => {
    onPress?.(item);
  }, [item, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.card, featured ? styles.featured : styles.grid]}
      accessibilityRole="button"
      accessibilityLabel={item.title}
    >
      <Image
        source={item.image}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        transition={180}
        cachePolicy="memory-disk"
      />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: item.overlayColor }]} />

      <View style={styles.topRow}>
        <IconCircle icon={item.icon} size={featured ? 38 : 34} />
        <Badge label={item.badge} />
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.textBlock}>
          <Text style={[styles.title, featured && styles.titleFeatured]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={featured ? 2 : 2}>
            {item.description}
          </Text>
        </View>
        <ArrowCircleButton onPress={handlePress} size={featured ? 38 : 34} />
      </View>
    </Pressable>
  );
}

export const EcosystemCard = memo(EcosystemCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.xl,
    overflow: 'hidden',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  featured: {
    width: '100%',
    minHeight: 168,
  },
  grid: {
    flex: 1,
    minHeight: 168,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Colors.textOnDark,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  titleFeatured: {
    fontSize: FontSize.xl,
  },
  description: {
    color: Colors.textOnDarkMuted,
    fontSize: FontSize.xs,
    lineHeight: 16,
  },
});
