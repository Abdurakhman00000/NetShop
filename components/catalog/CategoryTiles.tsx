import { Ionicons } from '@expo/vector-icons';
import { Image, type ImageSource } from 'expo-image';
import { memo, useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CatalogCategoryImages } from '@/constants/images';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { Category } from '@/types/common';

type CategoryTilesProps = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Local photos keyed by category slug. */
  images?: Record<string, ImageSource>;
};

const TILE_HEIGHT = 108;
const WIDE = 172;
const NARROW = 128;

/** Longest word that still fits a narrow tile without breaking mid-word. */
const NARROW_MAX_WORD = 11;

function needsWide(name: string): boolean {
  return name.split(/\s+/).some((word) => word.length > NARROW_MAX_WORD);
}

function resolveImage(
  cat: Category,
  images: Record<string, ImageSource>,
): ImageSource | null {
  if (/^https?:\/\//.test(cat.icon)) return { uri: cat.icon };
  return images[cat.slug] ?? null;
}

type TileProps = {
  category: Category;
  source: ImageSource | null;
  width: number;
  active: boolean;
  onPress: () => void;
};

const Tile = memo(function Tile({ category, source, width, active, onPress }: TileProps) {
  const imageSize = width === WIDE ? 96 : 80;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.tile,
        { width },
        active && styles.tileActive,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      accessibilityLabel={category.name}
    >
      {source ? (
        <Image
          source={source}
          style={[styles.image, { width: imageSize, height: imageSize }]}
          contentFit="contain"
          transition={150}
        />
      ) : (
        <View style={styles.fallback}>
          <Ionicons name="cube-outline" size={30} color={Colors.textMuted} />
        </View>
      )}
      <Text style={styles.label} numberOfLines={2}>
        {category.name}
      </Text>
    </Pressable>
  );
});

function CategoryTilesComponent({
  categories,
  selectedId,
  onSelect,
  images = CatalogCategoryImages,
}: CategoryTilesProps) {
  const rows = useMemo(() => {
    const half = Math.ceil(categories.length / 2);
    return [categories.slice(0, half), categories.slice(half)];
  }, [categories]);

  if (categories.length === 0) return null;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((cat, i) => {
              const active = selectedId === cat.id;
              // Stagger widths between rows so the grid reads as a mosaic.
              const wide = (i + rowIndex) % 2 === 0 || needsWide(cat.name);
              return (
                <Tile
                  key={cat.id}
                  category={cat}
                  source={resolveImage(cat, images)}
                  width={wide ? WIDE : NARROW}
                  active={active}
                  onPress={() => onSelect(active ? null : cat.id)}
                />
              );
            })}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

export const CategoryTiles = memo(CategoryTilesComponent);

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs,
  },
  grid: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  tile: {
    height: TILE_HEIGHT,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.surface,
    overflow: 'hidden',
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
  tileActive: {
    borderWidth: 2,
    borderColor: Colors.ink,
    paddingHorizontal: Spacing.md - 1,
    paddingTop: Spacing.md - 1,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.md,
    lineHeight: 19,
    color: Colors.ink,
  },
  image: {
    position: 'absolute',
    right: -4,
    bottom: -6,
  },
  fallback: {
    position: 'absolute',
    right: Spacing.md,
    bottom: Spacing.md,
  },
});
