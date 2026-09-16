import { memo, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

type SearchFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: () => void;
};

function SearchFieldComponent({
  value,
  onChangeText,
  placeholder = 'Поиск',
  onSubmit,
}: SearchFieldProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.wrap, focused && styles.focused]}>
      <Ionicons name="search" size={18} color={Colors.textMuted} />
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
      />
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
  focused: {
    borderColor: Colors.brand,
  },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.text,
    paddingVertical: 0,
  },
});
