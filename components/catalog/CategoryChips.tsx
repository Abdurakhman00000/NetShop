import { memo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';
import type { Category } from '@/types/common';

type CategoryChipsProps = {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  /** Flatten first-level children into chips when parents have children. */
  flattenChildren?: boolean;
  allLabel?: string;
  tone?: 'brand' | 'dark';
};

function flatten(categories: Category[]): Category[] {
  const out: Category[] = [];
  for (const cat of categories) {
    if (cat.children?.length) {
      out.push(...cat.children);
    } else {
      out.push(cat);
    }
  }
  return out;
}

function CategoryChipsComponent({
  categories,
  selectedId,
  onSelect,
  flattenChildren = true,
  allLabel = 'Все',
  tone = 'brand',
}: CategoryChipsProps) {
  const chips = flattenChildren ? flatten(categories) : categories;
  const activeStyle = tone === 'dark' ? styles.chipActiveDark : styles.chipActive;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={[styles.chip, selectedId == null && activeStyle]}
      >
        <Text style={[styles.label, selectedId == null && styles.labelActive]}>
          {allLabel}
        </Text>
      </Pressable>
      {chips.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(active ? null : cat.id)}
            style={[styles.chip, active && activeStyle]}
          >
            <Text style={[styles.label, active && styles.labelActive]}>{cat.name}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

export const CategoryChips = memo(CategoryChipsComponent);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  chip: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.brand,
    borderColor: Colors.brand,
  },
  chipActiveDark: {
    backgroundColor: Colors.ink,
    borderColor: Colors.ink,
  },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.textOnDark,
  },
});
