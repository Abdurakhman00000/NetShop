import { memo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

type AuthTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
  isPassword?: boolean;
};

function AuthTextFieldComponent({
  label,
  error,
  isPassword,
  style,
  ...rest
}: AuthTextFieldProps) {
  const [secure, setSecure] = useState(Boolean(isPassword));

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, error ? styles.fieldError : null]}>
        <TextInput
          {...rest}
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={secure}
          autoCapitalize={rest.autoCapitalize ?? 'none'}
          autoCorrect={rest.autoCorrect ?? false}
        />
        {isPassword ? (
          <Pressable
            onPress={() => setSecure((v) => !v)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={secure ? 'Показать пароль' : 'Скрыть пароль'}
          >
            <Ionicons
              name={secure ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={Colors.textMuted}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

export const AuthTextField = memo(AuthTextFieldComponent);

const styles = StyleSheet.create({
  wrap: {
    gap: Spacing.sm,
  },
  label: {
    fontFamily: 'DMSans_500Medium',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    minHeight: 52,
    gap: Spacing.sm,
  },
  fieldError: {
    borderColor: Colors.error,
  },
  input: {
    flex: 1,
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.md,
    color: Colors.text,
    paddingVertical: Spacing.md,
  },
  error: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.xs,
    color: Colors.error,
  },
});
