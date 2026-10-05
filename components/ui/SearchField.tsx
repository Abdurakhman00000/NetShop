import { Ionicons } from '@expo/vector-icons';
import { memo, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
  autoFocus?: boolean;
  /** Remove horizontal margin when embedded in custom layouts. */
  flush?: boolean;
  /** `onDark` renders a solid white pill for dark headers. */
  tone?: 'default' | 'onDark';
} & Pick<TextInputProps, 'onFocus' | 'onBlur'>;

function SearchFieldComponent({
  value,
  onChangeText,
  placeholder = 'Поиск',
  onSubmit,
  autoFocus = false,
  flush = false,
  tone = 'default',
}: SearchFieldProps) {
  const [focused, setFocused] = useState(false);
  const onDark = tone === 'onDark';

  return (
    <View
      style={[
        styles.wrap,
        flush && styles.flush,
        onDark && styles.onDark,
        focused && (onDark ? styles.focusedOnDark : styles.focused),
      ]}
    >
      <Ionicons
        name="search"
        size={onDark ? 20 : 18}
        color={onDark ? Colors.textSecondary : Colors.textMuted}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        style={styles.input}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoCorrect={false}
        autoCapitalize="none"
        autoFocus={autoFocus}
        clearButtonMode="never"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Очистить"
        >
          <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
        </Pressable>
      ) : null}
    </View>
  );
}

export const SearchField = memo(SearchFieldComponent);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    borderRadius: Radii.pill,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.lg,
  },
  flush: {
    marginHorizontal: 0,
  },
  focused: {
    borderColor: Colors.brand,
  },
  onDark: {
    backgroundColor: Colors.surfaceElevated,
    borderColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    paddingVertical: 14,
  },
  focusedOnDark: {
    borderColor: Colors.textMuted,
  },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.text,
    paddingVertical: 0,
  },
});
