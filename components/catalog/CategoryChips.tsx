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
}: CategoryChipsProps) {
  const chips = flattenChildren ? flatten(categories) : categories;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      <Pressable
        onPress={() => onSelect(null)}
        style={[styles.chip, selectedId == null && styles.chipActive]}
      >
        <Text style={[styles.label, selectedId == null && styles.labelActive]}>Все</Text>
      </Pressable>
      {chips.map((cat) => {
        const active = selectedId === cat.id;
        return (
          <Pressable
            key={cat.id}
            onPress={() => onSelect(active ? null : cat.id)}
            style={[styles.chip, active && styles.chipActive]}
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
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  labelActive: {
    color: Colors.textOnDark,
  },
});
