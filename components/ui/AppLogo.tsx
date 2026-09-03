import { Ionicons } from '@expo/vector-icons';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { Brand } from '@/constants/brand';
import { Colors, FontSize, Radii, Spacing } from '@/constants/theme';

type AppLogoProps = {
  variant?: 'light' | 'dark';
  showName?: boolean;
  size?: 'sm' | 'md';
  style?: StyleProp<ViewStyle>;
};

function AppLogoComponent({
  variant = 'dark',
  showName = true,
  size = 'md',
  style,
}: AppLogoProps) {
  const isLight = variant === 'light';
  const markSize = size === 'sm' ? 28 : 32;
  const fontSize = size === 'sm' ? FontSize.md : FontSize.lg;

  return (
    <View style={[styles.row, style]}>
      <View
        style={[
          styles.mark,
          {
            width: markSize,
            height: markSize,
            borderRadius: size === 'sm' ? 8 : 10,
          },
        ]}
      >
        <Text style={[styles.markText, { fontSize: size === 'sm' ? 14 : 16 }]}>
          {Brand.mark}
        </Text>
      </View>
      {showName ? (
        <Text
          style={[
            styles.name,
            {
              color: isLight ? Colors.textOnDark : Colors.text,
              fontSize,
            },
          ]}
        >
          {Brand.name}
        </Text>
      ) : null}
    </View>
  );
}

export const AppLogo = memo(AppLogoComponent);

type LocationChipProps = {
  city: string;
  onPress?: () => void;
};

function LocationChipComponent({ city, onPress }: LocationChipProps) {
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      style={styles.locationRow}
      accessibilityRole="button"
      accessibilityLabel={`Город: ${city}`}
    >
      <Ionicons name="location-sharp" size={14} color={Colors.brand} />
      <Text style={styles.locationText}>{city}</Text>
      <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
    </Pressable>
  );
}

export const LocationChip = memo(LocationChipComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  mark: {
    backgroundColor: Colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markText: {
    color: Colors.textOnDark,
    fontWeight: '700',
  },
  name: {
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  locationText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
