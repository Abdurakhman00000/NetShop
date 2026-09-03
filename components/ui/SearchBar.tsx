import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

type SearchBarProps = {
  placeholder?: string;
  onPress?: () => void;
};

function SearchBarComponent({
  placeholder = 'Поиск по всей экосистеме',
  onPress,
}: SearchBarProps) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.container}
      accessibilityRole="search"
      accessibilityLabel={placeholder}
    >
      <Ionicons name="search" size={18} color={Colors.textMuted} />
      <Text style={styles.placeholder} numberOfLines={1}>
        {placeholder}
      </Text>
    </Pressable>
  );
}

export const SearchBar = memo(SearchBarComponent);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
  },
  placeholder: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.textMuted,
  },
});
