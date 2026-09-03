import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, FontSize, Spacing } from '@/constants/theme';

type SectionHeaderProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  meta?: string;
};

function SectionHeaderComponent({
  title,
  actionLabel,
  onActionPress,
  meta,
}: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {meta ? (
        <View style={styles.metaRow}>
          <View style={styles.dot} />
          <Text style={styles.meta}>{meta}</Text>
        </View>
      ) : null}
      {actionLabel ? (
        <Pressable onPress={onActionPress} hitSlop={8}>
          <Text style={styles.action}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export const SectionHeader = memo(SectionHeaderComponent);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  title: {
    flex: 1,
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.brand,
  },
  meta: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  action: {
    fontSize: FontSize.sm,
    color: Colors.brand,
    fontWeight: '600',
  },
});
