import { memo } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

type BadgeProps = {
  label: string;
  style?: StyleProp<ViewStyle>;
};

function BadgeComponent({ label, style }: BadgeProps) {
  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

export const Badge = memo(BadgeComponent);

const styles = StyleSheet.create({
  badge: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radii.pill,
  },
  text: {
    color: Colors.textOnDark,
    fontSize: FontSize.xs,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
});
