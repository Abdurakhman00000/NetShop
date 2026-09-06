import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Radii, Shadows, Spacing } from '@/constants/theme';

export type ProfileStatsData = {
  orders: number;
  reviews: number;
  favorites: number;
};

type ProfileStatsProps = {
  stats: ProfileStatsData;
};

function StatCell({ value, label }: { value: number; label: string }) {
  return (
    <View style={styles.cell}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

function ProfileStatsComponent({ stats }: ProfileStatsProps) {
  return (
    <View style={styles.card}>
      <StatCell value={stats.orders} label="Заказы" />
      <View style={styles.divider} />
      <StatCell value={stats.reviews} label="Отзывы" />
      <View style={styles.divider} />
      <StatCell value={stats.favorites} label="Избранное" />
    </View>
  );
}

export const ProfileStats = memo(ProfileStatsComponent);

const styles = StyleSheet.create({
  card: {
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surfaceElevated,
    borderRadius: Radii.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    ...Shadows.soft,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  value: {
    fontFamily: 'DMSans_700Bold',
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  label: {
    fontFamily: 'DMSans_400Regular',
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
    backgroundColor: Colors.border,
  },
});
