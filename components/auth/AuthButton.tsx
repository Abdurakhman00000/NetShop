import { memo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

type Variant = 'primary' | 'outline' | 'ghost';

type AuthButtonProps = Omit<PressableProps, 'style'> & {
  label: string;
  loading?: boolean;
  variant?: Variant;
  style?: StyleProp<ViewStyle>;
};

function AuthButtonComponent({
  label,
  loading,
  variant = 'primary',
  disabled,
  style,
  ...rest
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      {...rest}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'ghost' && styles.ghost,
        pressed && !isDisabled && styles.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityState={{ disabled: Boolean(isDisabled), busy: Boolean(loading) }}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? Colors.textOnDark : Colors.brand}
        />
      ) : (
        <Text
          style={[
            styles.label,
            variant === 'primary' && styles.labelOnPrimary,
            variant === 'outline' && styles.labelOutline,
            variant === 'ghost' && styles.labelGhost,
          ]}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}

export const AuthButton = memo(AuthButtonComponent);

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  primary: {
    backgroundColor: Colors.brand,
  },
  outline: {
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: Colors.brand,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.88,
  },
  disabled: {
    opacity: 0.55,
  },
  label: {
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.md,
  },
  labelOnPrimary: {
    color: Colors.textOnDark,
  },
  labelOutline: {
    color: Colors.brand,
  },
  labelGhost: {
    color: Colors.brand,
    fontFamily: 'DMSans_500Medium',
  },
});
