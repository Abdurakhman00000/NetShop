import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors } from '@/constants/theme';
import type { EcosystemIcon } from '@/types/home';

const ICON_MAP: Record<EcosystemIcon, keyof typeof Ionicons.glyphMap> = {
  hammer: 'hammer-outline',
  settings: 'settings-outline',
  sparkles: 'sparkles-outline',
  hexagon: 'cube-outline',
  diamond: 'color-wand-outline',
};

type IconCircleProps = {
  icon: EcosystemIcon;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

function IconCircleComponent({ icon, size = 36, style }: IconCircleProps) {
  return (
    <View
      style={[
        styles.circle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        style,
      ]}
    >
      <Ionicons name={ICON_MAP[icon]} size={size * 0.45} color={Colors.textOnDark} />
    </View>
  );
}

export const IconCircle = memo(IconCircleComponent);

type ArrowCircleButtonProps = {
  onPress?: () => void;
  size?: number;
  disabled?: boolean;
};

function ArrowCircleButtonComponent({
  onPress,
  size = 36,
  disabled = false,
}: ArrowCircleButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      hitSlop={6}
      style={[
        styles.arrow,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        disabled && styles.arrowDisabled,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Открыть"
      accessibilityState={{ disabled }}
    >
      <Ionicons name="arrow-forward" size={size * 0.42} color={Colors.text} />
    </Pressable>
  );
}

export const ArrowCircleButton = memo(ArrowCircleButtonComponent);

const styles = StyleSheet.create({
  circle: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    backgroundColor: Colors.textOnDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowDisabled: {
    opacity: 0.55,
  },
});
